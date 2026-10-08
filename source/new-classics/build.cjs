const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const books = require('./content.cjs');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const javascript = ['paintings.js', 'motion.js'].map(name => fs.readFileSync(path.join(root, name), 'utf8')).join('\n');
const attr = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const plain = value => value.replace(/<[^>]*>/g, '').replace(/\s+/g, '');

const requested = process.argv.slice(2);
if (requested.some(slug => !books.some(book => book.slug === slug))) throw new Error('Unknown work requested');
for (const book of books.filter(book => !requested.length || requested.includes(book.slug))) {
  const expected = fs.readFileSync(path.join(root, book.source), 'utf8').replace(/\s+/g, '');
  const actual = plain(book.scenes.flatMap(scene => scene.paragraphs).join(''));
  if (actual !== expected) throw new Error(book.title + ': the complete original text does not match the scenes');
  const ids = new Set(book.scenes.map(scene => scene.id));
  if (ids.size !== book.scenes.length) throw new Error('Duplicate scene id');
  const sections = book.scenes.map((scene, index) => {
    if (scene.portal && !ids.has(scene.portal.to)) throw new Error('Broken portal');
    const image = './art/' + String(index + 1).padStart(2, '0') + '-' + scene.id + '.webp';
    if (!fs.existsSync(path.join(root, '..', '..', book.slug, image))) throw new Error('Missing artwork: ' + image);
    const classes = ['scene', scene.dark ? 'night' : '', scene.dense ? 'dense' : '', scene.softLight ? 'soft-light' : '', scene.mobileBottom ? 'mobile-bottom' : ''].filter(Boolean).join(' ');
    const distance = scene.distance || (plain(scene.paragraphs.join('')).length > 65 ? 2.15 : 1.9);
    const camera = scene.camera || (index % 2 ? [1.025,1.075] : [1.08,1.025]);
    const portal = scene.portal ? `<a class="portal" href="#${scene.portal.to}" data-x="${scene.portal.point[0]}" data-y="${scene.portal.point[1]}" aria-label="${attr(scene.portal.label)}" hidden></a>` : '';
    return `<section class="${classes}" id="${scene.id}" aria-label="${attr(scene.label)}" data-distance="${distance}" data-camera="${camera.join(',')}" data-weather="${scene.weather.join(',')}" data-fire="${(scene.fire || [.5,.5]).join(',')}" style="--position:${scene.position || '50% 50%'};--mobile-position:${scene.mobile}">
  <div class="scene-frame">
    <img class="scene-image" src="${image}" width="1536" height="1024" alt="${attr(scene.alt)}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    <div class="prose" tabindex="-1">${scene.paragraphs.map(text => '<p>' + text + '</p>').join('')}</div>
    ${portal}
  </div>
</section>`;
  }).join('\n');
  const favicon = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#e3ded0"/><text x="20" y="29" text-anchor="middle" font-family="serif" font-size="28" fill="#465346">${book.seal}</text></svg>`);
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#e3ded0">
<meta name="description" content="${book.author}《${book.title}》。${book.scenes.length} 幅画，完整原文。">
<link rel="icon" href="${favicon}">
<title>${book.title}</title>
<script>if (!matchMedia('(prefers-reduced-motion: reduce)').matches && innerHeight >= 600) { document.documentElement.classList.add('motion-candidate'); setTimeout(() => document.documentElement.classList.remove('motion-candidate'), 3000); }</script>
<style>${css}</style>
</head>
<body>
<h1 class="sr-only">${book.title}</h1>
<canvas id="living-paintings" aria-hidden="true"></canvas>
<main>${sections}</main>
<div id="mist" aria-hidden="true"></div>
<div id="passage" aria-hidden="true" hidden></div>
<script>${javascript}</script>
</body>
</html>\n`;
  const output = path.join(root, '..', '..', book.slug, 'index.html');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html, { mode: 0o644 });
  console.log(`${book.title}: ${book.scenes.length} paintings, ${expected.length} characters with punctuation, ${(Buffer.byteLength(html)/1e6).toFixed(2)} MB`);
}
