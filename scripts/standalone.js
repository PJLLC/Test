import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Export a portable HTML file that works without a server or network access.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const mime = {svg:'image/svg+xml',ttf:'font/ttf'};
const dataUrl = async path => {
  const bytes = await readFile(resolve(dist, path.replace(/^(?:\.\.\/|\.\/|\/)+/, '')));
  return `data:${mime[path.split('.').pop()]};base64,${bytes.toString('base64')}`;
};
let html = await readFile(resolve(dist, 'index.html'), 'utf8');
const scriptTag = html.match(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/);
const styleTag = html.match(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
if (!scriptTag || !styleTag) throw new Error('Build output is missing its script or stylesheet. Run npm run build first.');
let script = await readFile(resolve(dist, scriptTag[1].replace(/^(?:\.\/|\/)/, '')), 'utf8');
let css = await readFile(resolve(dist, styleTag[1].replace(/^(?:\.\/|\/)/, '')), 'utf8');
for (const path of new Set(script.match(/(?:\.\/|\/)?art\/[a-z-]+\.svg/g) || [])) {
  script = script.replaceAll(path, await dataUrl(path));
}
for (const path of new Set(css.match(/(?:\.\.\/|\.\/|\/)?fonts\/[a-z-]+\.ttf/g) || [])) {
  css = css.replaceAll(path, await dataUrl(path));
}
html = html.replace(scriptTag[0], '').replace(styleTag[0], `<style>${css}</style>`);
html = html.replace(/(?:\.\/|\/)?favicon\.svg/, await dataUrl('/favicon.svg'));
// Put the inline module after the application root so it also runs from file://.
html = html.replace('</body>', `<script type="module">${script.replaceAll('</script', '<\\/script')}</script>\n</body>`);
const output = resolve(dist, 'elsewhere.html');
await writeFile(output, html);
console.log(`Portable website created: ${output}`);
