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

export function colorDistance(left, right) {
  return Math.sqrt(
    (left[0] - right[0]) ** 2
      + (left[1] - right[1]) ** 2
      + (left[2] - right[2]) ** 2,
  );
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)] || 0;
}

export function sampleEdgeBackground(image, sampleStep = 8) {
  const samples = [];
  const add = (x, y) => {
    const offset = (y * image.width + x) * 4;
    if (image.rgba[offset + 3] < 240) return;
    samples.push([
      image.rgba[offset],
      image.rgba[offset + 1],
      image.rgba[offset + 2],
    ]);
  };
  for (let x = 0; x < image.width; x += sampleStep) {
    add(x, 0);
    add(x, image.height - 1);
  }
  for (let y = 0; y < image.height; y += sampleStep) {
    add(0, y);
    add(image.width - 1, y);
  }
  if (!samples.length) return [0, 0, 0];
  return [0, 1, 2].map((channel) => median(samples.map((sample) => sample[channel])));
}

function chromaSpread(rgb) {
  return Math.max(...rgb) - Math.min(...rgb);
}

export function removeTechnicalBackground(image, {
  background = sampleEdgeBackground(image),
  tolerance = 38,
  feather = 24,
  shadowTolerance = 34,
} = {}) {
  const rgba = Buffer.from(image.rgba);
  const visited = new Uint8Array(image.width * image.height);
  const queue = [];
  const inner = Math.max(0, tolerance);
  const outer = inner + Math.max(1, feather);
  // Shadow tolerance is retained as an API-compatible option, but must not
  // widen the connected flood into light neutral subject details.
  void shadowTolerance;
  const floodLimit = outer;
  const backgroundChroma = chromaSpread(background);
  const neutralLimit = Math.max(12, backgroundChroma + 10);
  const enqueue = (x, y) => {
    const index = y * image.width + x;
    if (!visited[index]) {
      visited[index] = 1;
      queue.push(index);
    }
  };
  for (let x = 0; x < image.width; x += 1) {
    enqueue(x, 0);
    enqueue(x, image.height - 1);
  }
  for (let y = 0; y < image.height; y += 1) {
    enqueue(0, y);
    enqueue(image.width - 1, y);
  }

  let removedPixels = 0;
  let featheredPixels = 0;
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const index = queue[cursor];
    const x = index % image.width;
    const y = Math.floor(index / image.width);
    const offset = index * 4;
    const rgb = [rgba[offset], rgba[offset + 1], rgba[offset + 2]];
    const distance = colorDistance(rgb, background);
    const originalAlpha = rgba[offset + 3];
    const chroma = chromaSpread(rgb);
    if ((distance > floodLimit || chroma > neutralLimit) && originalAlpha > 8) continue;

    let nextAlpha = originalAlpha;
    if (distance <= inner) nextAlpha = 0;
    else if (distance <= outer) {
      nextAlpha = Math.round(originalAlpha * ((distance - inner) / (outer - inner)));
    }

    if (nextAlpha === 0 && originalAlpha > 0) removedPixels += 1;
    if (nextAlpha > 0 && nextAlpha < originalAlpha) featheredPixels += 1;
    rgba[offset + 3] = nextAlpha;
    // Preserve source RGB. Alpha-only removal cannot amplify small channel
    // differences into artificial yellow/red colors at translucent edges.

    if (x > 0) enqueue(x - 1, y);
    if (x + 1 < image.width) enqueue(x + 1, y);
    if (y > 0) enqueue(x, y - 1);
    if (y + 1 < image.height) enqueue(x, y + 1);
  }
  return {
    ...image,
    colorType: 6,
    rgba,
    removedPixels,
    featheredPixels,
    sampledBackground: background.map(Math.round),
  };
}

export function checkerboardScore(image) {
  if (alphaMetrics(image).transparent_fraction > 0.01) return 0;
  const step = Math.max(4, Math.floor(Math.min(image.width, image.height) / 48));
  let alternating = 0;
  let comparisons = 0;
  const luminance = (x, y) => {
    const offset = (y * image.width + x) * 4;
    return image.rgba[offset] * 0.2126
      + image.rgba[offset + 1] * 0.7152
      + image.rgba[offset + 2] * 0.0722;
  };
  for (let y = 0; y + step < image.height; y += step) {
    for (let x = 0; x + step < image.width; x += step) {
      const horizontal = luminance(x, y) - luminance(x + step, y);
      const vertical = luminance(x, y) - luminance(x, y + step);
      comparisons += 2;
      if (Math.abs(horizontal) > 8 && Math.abs(horizontal) < 55) alternating += 1;
      if (Math.abs(vertical) > 8 && Math.abs(vertical) < 55) alternating += 1;
    }
  }
  return comparisons ? alternating / comparisons : 0;
}

export function residualBackgroundFraction(image, background, tolerance = 38) {
  let residual = 0;
  let considered = 0;
  for (let index = 0; index < image.width * image.height; index += 1) {
    const offset = index * 4;
    const alpha = image.rgba[offset + 3];
    if (alpha <= 8) continue;
    considered += 1;
    if (colorDistance([
      image.rgba[offset],
      image.rgba[offset + 1],
      image.rgba[offset + 2],
    ], background) <= tolerance) residual += 1;
  }
  return considered ? residual / considered : 0;
}

export function externalShadowFraction(image) {
  let shadow = 0;
  const pixels = image.width * image.height;
  for (let index = 0; index < pixels; index += 1) {
    const offset = index * 4;
    const alpha = image.rgba[offset + 3];
    if (alpha < 8 || alpha > 210) continue;
    const max = Math.max(image.rgba[offset], image.rgba[offset + 1], image.rgba[offset + 2]);
    const min = Math.min(image.rgba[offset], image.rgba[offset + 1], image.rgba[offset + 2]);
    const luminance = (max + min) / 2;
    if (max - min < 22 && luminance < 105) shadow += 1;
  }
  return shadow / pixels;
}

export function perceptualHash(image) {
  const values = [];
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 9; x += 1) {
      const sourceX = Math.min(image.width - 1, Math.floor((x + 0.5) * image.width / 9));
      const sourceY = Math.min(image.height - 1, Math.floor((y + 0.5) * image.height / 8));
      const offset = (sourceY * image.width + sourceX) * 4;
      const alpha = image.rgba[offset + 3] / 255;
      values.push(alpha * (
        image.rgba[offset] * 0.2126
          + image.rgba[offset + 1] * 0.7152
          + image.rgba[offset + 2] * 0.0722
      ) + (1 - alpha) * 255);
    }
  }
  let bits = "";
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      bits += values[y * 9 + x] > values[y * 9 + x + 1] ? "1" : "0";
    }
  }
  return BigInt(`0b${bits}`).toString(16).padStart(16, "0");
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
