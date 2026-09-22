import fs from 'node:fs';
import path from 'node:path';

// If a `<name>@2x.<ext>` companion file exists in public/, serve it as the 2x
// srcset candidate so high-DPI screens get real detail instead of the browser
// upscaling/downscaling a single asset to fit every pixel density.
export function twoXSrc(imagePath: string): string | null {
  const ext = path.extname(imagePath);
  const twoX = `${imagePath.slice(0, -ext.length)}@2x${ext}`;
  return fs.existsSync(path.join(process.cwd(), 'public', twoX)) ? twoX : null;
}
