import fs from "node:fs";
import zlib from "node:zlib";

const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data = Buffer.alloc(0)) {
  const name = Buffer.from(type, "ascii");
  const output = Buffer.alloc(12 + data.length);
  output.writeUInt32BE(data.length, 0);
  name.copy(output, 4);
  data.copy(output, 8);
  output.writeUInt32BE(crc32(Buffer.concat([name, data])), 8 + data.length);
  return output;
}

export function decodePng(filePath) {
  const file = fs.readFileSync(filePath);
  if (!file.subarray(0, 8).equals(SIGNATURE)) throw new Error("Arquivo não possui assinatura PNG válida.");
  let offset = 8;
  let ihdr;
  const idat = [];
  while (offset < file.length) {
    const length = file.readUInt32BE(offset);
    const type = file.toString("ascii", offset + 4, offset + 8);
    const data = file.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") ihdr = Buffer.from(data);
    if (type === "IDAT") idat.push(Buffer.from(data));
    offset += 12 + length;
    if (type === "IEND") break;
  }
  if (!ihdr) throw new Error("PNG sem IHDR.");
  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const bitDepth = ihdr[8];
  const colorType = ihdr[9];
  const interlace = ihdr[12];
  if (bitDepth !== 8 || interlace !== 0 || ![0, 2, 4, 6].includes(colorType)) {
    throw new Error(`PNG não suportado pelo validador local (bitDepth=${bitDepth}, colorType=${colorType}, interlace=${interlace}).`);
  }
  const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
  const stride = width * channels;
  const inflated = zlib.inflateSync(Buffer.concat(idat));
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    const sourceOffset = y * (stride + 1);
    const filter = inflated[sourceOffset];
    for (let x = 0; x < stride; x += 1) {
      const value = inflated[sourceOffset + 1 + x];
      const left = x >= channels ? raw[y * stride + x - channels] : 0;
      const up = y > 0 ? raw[(y - 1) * stride + x] : 0;
      const upperLeft = y > 0 && x >= channels ? raw[(y - 1) * stride + x - channels] : 0;
      const decoded = filter === 0 ? value
        : filter === 1 ? value + left
          : filter === 2 ? value + up
            : filter === 3 ? value + Math.floor((left + up) / 2)
              : filter === 4 ? value + paeth(left, up, upperLeft)
                : NaN;
      if (!Number.isFinite(decoded)) throw new Error(`Filtro PNG desconhecido: ${filter}`);
      raw[y * stride + x] = decoded & 255;
    }
  }
  const rgba = Buffer.alloc(width * height * 4);
  for (let index = 0; index < width * height; index += 1) {
    const source = index * channels;
    const target = index * 4;
    if (colorType === 0) rgba.fill(raw[source], target, target + 3);
    if (colorType === 2 || colorType === 6) {
      rgba[target] = raw[source]; rgba[target + 1] = raw[source + 1]; rgba[target + 2] = raw[source + 2];
    }
    if (colorType === 4) rgba.fill(raw[source], target, target + 3);
    rgba[target + 3] = colorType === 4 ? raw[source + 1] : colorType === 6 ? raw[source + 3] : 255;
  }
  return { width, height, bitDepth, colorType, rgba, fileBytes: file.length };
}

export function encodeRgbaPng({ width, height, rgba }, filePath) {
  const rows = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y += 1) {
    const offset = y * (1 + width * 4);
    rows[offset] = 0;
    rgba.copy(rows, offset + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  fs.writeFileSync(filePath, Buffer.concat([SIGNATURE, chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(rows, { level: 9 })), chunk("IEND")]));
}

export function alphaMetrics(image) {
  let transparent = 0;
  let translucent = 0;
  let edgeOpaque = 0;
  let edgeTotal = 0;
  let minX = image.width;
  let minY = image.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const alpha = image.rgba[(y * image.width + x) * 4 + 3];
      if (alpha === 0) transparent += 1;
      else {
        if (alpha < 255) translucent += 1;
        minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      }
      if (x === 0 || y === 0 || x === image.width - 1 || y === image.height - 1) {
        edgeTotal += 1;
        if (alpha > 8) edgeOpaque += 1;
      }
    }
  }
  const pixels = image.width * image.height;
  return {
    transparent_fraction: transparent / pixels,
    translucent_fraction: translucent / pixels,
    edge_opaque_fraction: edgeTotal ? edgeOpaque / edgeTotal : 1,
    bounding_box: maxX >= 0 ? { min_x: minX, min_y: minY, max_x: maxX, max_y: maxY } : null,
  };
}

export function looksLikeEmbeddedCheckerboard(image) {
  const samples = [];
  const step = Math.max(4, Math.floor(Math.min(image.width, image.height) / 64));
  for (let y = 0; y < Math.min(image.height, step * 8); y += step) {
    for (let x = 0; x < Math.min(image.width, step * 8); x += step) {
      const offset = (y * image.width + x) * 4;
      if (image.rgba[offset + 3] < 250) return false;
      samples.push([image.rgba[offset], image.rgba[offset + 1], image.rgba[offset + 2]]);
    }
  }
  const colors = new Set(samples.map((rgb) => rgb.map((v) => Math.round(v / 16) * 16).join(",")));
  return colors.size >= 2 && colors.size <= 4;
}

export function removeEdgeBackground(image, tolerance = 38) {
  const rgba = Buffer.from(image.rgba);
  const corners = [[0, 0], [image.width - 1, 0], [0, image.height - 1], [image.width - 1, image.height - 1]];
  const background = corners.reduce((sum, [x, y]) => {
    const offset = (y * image.width + x) * 4;
    return sum.map((value, channel) => value + rgba[offset + channel]);
  }, [0, 0, 0]).map((value) => value / corners.length);
  const visited = new Uint8Array(image.width * image.height);
  const queue = [];
  const enqueue = (x, y) => {
    const index = y * image.width + x;
    if (!visited[index]) { visited[index] = 1; queue.push(index); }
  };
  for (let x = 0; x < image.width; x += 1) { enqueue(x, 0); enqueue(x, image.height - 1); }
  for (let y = 0; y < image.height; y += 1) { enqueue(0, y); enqueue(image.width - 1, y); }
  let removed = 0;
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const index = queue[cursor];
    const x = index % image.width;
    const y = Math.floor(index / image.width);
    const offset = index * 4;
    const distance = Math.sqrt(
      (rgba[offset] - background[0]) ** 2 + (rgba[offset + 1] - background[1]) ** 2 + (rgba[offset + 2] - background[2]) ** 2,
    );
    if (distance > tolerance && rgba[offset + 3] > 8) continue;
    rgba[offset + 3] = 0;
    removed += 1;
    if (x > 0) enqueue(x - 1, y); if (x + 1 < image.width) enqueue(x + 1, y);
    if (y > 0) enqueue(x, y - 1); if (y + 1 < image.height) enqueue(x, y + 1);
  }
  return { ...image, colorType: 6, rgba, removedPixels: removed, sampledBackground: background.map(Math.round) };
}
