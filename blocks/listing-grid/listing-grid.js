/**
 * listing-grid — card grid for index pages (case studies, articles, products…).
 * Phase 7 will make this fetch an EDS query-index; for now it renders the
 * authored static cards (graceful fallback that always works).
 * Authoring: one row per card; cell holds optional <img>, a tag <p><em>, an
 * <h3> title, an optional <p> excerpt, and a link <a>.
 */
function buildCard(cell) {
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

export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'lg-grid';
  rows.forEach((row) => { const cell = row.querySelector(':scope > div') || row; if (cell.textContent.trim() || cell.querySelector('img,picture,a')) grid.append(buildCard(cell)); });
  block.replaceChildren(grid);
}
