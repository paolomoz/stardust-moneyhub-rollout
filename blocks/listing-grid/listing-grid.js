/**
 * listing-grid — card grid for index pages.
 * Renders the authored static cards immediately (graceful fallback that always
 * works), then enhances from the matching EDS query-index when available
 * (auto-updating, image-rich). The index is chosen by page path, or by an
 * authored `data-source` on the block's first cell.
 */
const PATH_INDEX = {
  '/case-studies': '/case-studies-index.json',
  '/articles': '/articles-index.json',
  '/press-and-partners': '/press-releases-index.json',
  '/products': '/products-index.json',
  '/use-cases': '/use-cases-index.json',
  '/glossary': '/glossary-index.json',
};

function buildCardFromCell(cell) {
  const link = cell.querySelector('a');
  const card = document.createElement('a');
  card.className = 'lg-card';
  card.href = link ? link.getAttribute('href') : '#';
  const img = cell.querySelector('picture, img');
  if (img) card.append(img.closest('picture') || img);
  const body = document.createElement('div');
  body.className = 'lg-body';
  const tag = cell.querySelector('em');
  if (tag) { const t = document.createElement('span'); t.className = 'lg-tag'; t.textContent = tag.textContent; body.append(t); }
  const h = cell.querySelector('h2,h3,h4');
  if (h) { const h3 = document.createElement('h3'); h3.textContent = h.textContent; body.append(h3); }
  cell.querySelectorAll('p').forEach((p) => { if (!p.querySelector('a, em') && p.textContent.trim()) { const ex = document.createElement('p'); ex.textContent = p.textContent.trim(); body.append(ex); } });
  const more = document.createElement('span'); more.className = 'lg-more'; more.textContent = 'Read more →'; body.append(more);
  card.append(body);
  return card;
}

function cardFromIndex(row) {
  const card = document.createElement('a');
  card.className = 'lg-card';
  card.href = row.path;
  if (row.image && !row.image.includes('default-meta')) {
    const img = document.createElement('img');
    img.src = row.image; img.alt = row.title || ''; img.loading = 'lazy';
    card.append(img);
  }
  const body = document.createElement('div');
  body.className = 'lg-body';
  if (row.category && row.category !== '0') { const t = document.createElement('span'); t.className = 'lg-tag'; t.textContent = row.category; body.append(t); }
  const h3 = document.createElement('h3'); h3.textContent = row.title || row.path; body.append(h3);
  if (row.description && row.description !== '0') { const ex = document.createElement('p'); ex.textContent = row.description.slice(0, 130); body.append(ex); }
  const more = document.createElement('span'); more.className = 'lg-more'; more.textContent = 'Read more →'; body.append(more);
  card.append(body);
  return card;
}

export default async function decorate(block) {
  const firstCell = block.querySelector(':scope > div > div');
  const authoredSource = firstCell?.dataset?.source;
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'lg-grid';
  // 1. static fallback
  rows.forEach((row) => { const cell = row.querySelector(':scope > div') || row; if (cell.textContent.trim() || cell.querySelector('img,picture,a')) grid.append(buildCardFromCell(cell)); });
  block.replaceChildren(grid);

  // 2. dynamic enhancement from the query-index
  const base = window.location.pathname.replace(/\/$/, '');
  const indexUrl = authoredSource || PATH_INDEX[base];
  if (!indexUrl) return;
  try {
    const res = await fetch(indexUrl);
    if (!res.ok) return;
    const json = await res.json();
    const data = (json.data || []).filter((r) => r.path && r.path !== `${base}/`);
    if (!data.length) return;
    // sort by publishDate desc when present
    data.sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''));
    const dgrid = document.createElement('div');
    dgrid.className = 'lg-grid';
    data.forEach((r) => dgrid.append(cardFromIndex(r)));
    block.replaceChildren(dgrid);
  } catch (e) { /* keep static fallback */ }
}
