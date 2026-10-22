/* eslint @typescript-eslint/no-require-imports: "off" -- Node.js asset generator */
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const checking = process.argv.includes("--check");

async function main() {
  const source = await fs.readFile(path.join(root, "src/brand/app-icon.svg"));
  const outputs = new Map([
    ["src/app/icon.svg", source],
    ["public/brand/app-icon.svg", source],
  ]);
  const rasters = new Map();

  for (const [name, size] of [
    ["favicon-16.png", 16],
    ["favicon-32.png", 32],
    ["favicon-48.png", 48],
    ["icon-64.png", 64],
    ["apple-touch-icon.png", 180],
    ["android-chrome-192x192.png", 192],
    ["android-chrome-512x512.png", 512],
    ["profile.png", 1024],
  ]) {
    const data = await sharp(source, { density: 384 }).resize(size, size).png().toBuffer();
    rasters.set(size, data);
    outputs.set(`public/brand/${name}`, data);
  }

  const sizes = [16, 32, 48];
  const header = Buffer.alloc(6 + sizes.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((size, index) => {
    const data = rasters.get(size);
    const entry = 6 + index * 16;
    header[entry] = size;
    header[entry + 1] = size;
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  const ico = Buffer.concat([header, ...sizes.map((size) => rasters.get(size))]);
  outputs.set("src/app/favicon.ico", ico);
  outputs.set("public/brand/favicon.ico", ico);
  outputs.set("src/app/apple-icon.png", rasters.get(180));

  outputs.set("public/brand/mark.svg", await fs.readFile(path.join(root, "src/brand/mark.svg")));
  const social = await require("./brand-social.cjs")(root);
  outputs.set("public/brand/share-card.png", await sharp(social).png().toBuffer());

  let failures = 0;
  for (const [name, expected] of outputs) {
    const destination = path.join(root, name);
    if (checking) {
      const actual = await fs.readFile(destination).catch((error) => {
        if (error.code === "ENOENT") return null;
        throw error;
      });
      if (!actual || !actual.equals(expected)) {
        console.error(`Outdated or missing: ${name}`);
        failures += 1;
      }
    } else {
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, expected);
    }
  }
  if (failures) process.exitCode = 1;
  else console.log(`${checking ? "Verified" : "Generated"} ${outputs.size} Paszed assets.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
