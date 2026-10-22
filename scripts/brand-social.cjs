/* eslint @typescript-eslint/no-require-imports: "off" -- Node.js asset generator */
const fs = require("node:fs/promises");
const path = require("node:path");

module.exports = async function createShareCard(root) {
  const mark = await fs.readFile(path.join(root, "src/brand/mark.svg"), "utf8");
  const symbol = mark.replace("<svg ", "<svg x=\"820\" y=\"205\" width=\"280\" height=\"280\" ");
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#050608"/>
    <rect x="28" y="28" width="1144" height="574" rx="16" fill="none" stroke="#302d29"/>
    <path d="M76 151H1124" stroke="#302d29"/>
    <text x="76" y="105" fill="#e8dfc9" font-family="monospace" font-size="34" font-weight="700" letter-spacing="-2">paszed<tspan fill="#c9a24a">_</tspan></text>
    <text x="1124" y="101" text-anchor="end" fill="#b8ae9c" font-family="monospace" font-size="15" letter-spacing="2">INDEPENDENT ENGINEER</text>
    <text x="70" y="283" fill="#e8dfc9" font-family="sans-serif" font-size="100" font-weight="800" letter-spacing="-5">Edvard</text>
    <text x="70" y="387" fill="#e8dfc9" font-family="sans-serif" font-size="100" font-weight="800" letter-spacing="-5">Pasz<tspan fill="#c9a24a">_</tspan></text>
    <text x="76" y="453" fill="#b8ae9c" font-family="sans-serif" font-size="25">Software Engineering, Systems &amp; AI</text>
    <text x="76" y="493" fill="#8e8577" font-family="sans-serif" font-size="21">Building software. Documenting the work.</text>
    <path d="M76 552H112" stroke="#c9a24a" stroke-width="3"/>
    <text x="128" y="559" fill="#c9a24a" font-family="monospace" font-size="19" letter-spacing="2">PASZED.COM</text>
    ${symbol}
  </svg>`);
};
