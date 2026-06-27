/**
 * article-header — eyebrow (category) + H1 + meta + optional lead image.
 * Authoring: cell with optional <p><em>category</em></p>, <h1>, <p>meta</p>,
 * and an optional <img> (lead image, rendered full-width below the header band).
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block;
  const band = document.createElement('div');
  band.className = 'ah-band';
  const inner = document.createElement('div');
  inner.className = 'ah-inner';
  const tag = cell.querySelector('em');
  if (tag) { const t = document.createElement('span'); t.className = 'ah-tag'; t.textContent = tag.textContent; inner.append(t); }
  const h = cell.querySelector('h1,h2');
  const h1 = document.createElement('h1');
  if (h) h1.innerHTML = (h.querySelector('h1,h2,h3') || h).innerHTML; else h1.textContent = (cell.textContent || '').trim();
  inner.append(h1);
  cell.querySelectorAll('p').forEach((p) => { if (!p.querySelector('em') && p.textContent.trim() && !p.querySelector('a')) { const m = document.createElement('p'); m.className = 'ah-meta'; m.innerHTML = p.innerHTML; inner.append(m); } });
  band.append(inner);
  const lead = cell.querySelector('picture, img');
  block.replaceChildren(band);
  if (lead) { const fig = document.createElement('div'); fig.className = 'ah-lead'; fig.append(lead.closest('picture') || lead); block.append(fig); }
}
