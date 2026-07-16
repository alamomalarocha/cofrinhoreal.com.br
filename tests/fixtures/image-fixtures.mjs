export function solidCharacterFixture({
  width = 64,
  height = 96,
  background = [119, 119, 119, 255],
  character = [245, 120, 145, 255],
} = {}) {
  const rgba = Buffer.alloc(width * height * 4);
  for (let index = 0; index < width * height; index += 1) {
    rgba.set(background, index * 4);
  }
  for (let y = 14; y < height - 12; y += 1) {
    for (let x = 14; x < width - 14; x += 1) {
      rgba.set(character, (y * width + x) * 4);
    }
  }
  return { width, height, colorType: 6, rgba };
}

export function checkerboardFixture({ width = 64, height = 96 } = {}) {
  const rgba = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const light = (Math.floor(x / 8) + Math.floor(y / 8)) % 2 === 0 ? 232 : 200;
      rgba.set([light, light, light, 255], (y * width + x) * 4);
    }
  }
  return { width, height, colorType: 6, rgba };
}
