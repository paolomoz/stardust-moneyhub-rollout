/**
 * cards — bordered icon+title+desc+link grid. Variant: `products`.
 * Authoring: one row per card; cell holds optional <img> (icon), an <h3>,
 * a <p> description, and a link (<a>). Section head as default content above.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'cards-grid';
  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    const card = document.createElement('article');
    card.className = 'card';
    const icon = cell.querySelector('picture, img');
    if (icon) { const i = document.createElement('div'); i.className = 'card-icon'; i.append(icon.closest('picture') || icon); card.append(i); }
    const h = cell.querySelector('h2,h3,h4');
    if (h) { const h3 = document.createElement('h3'); h3.innerHTML = h.innerHTML; card.append(h3); }
    cell.querySelectorAll('p').forEach((p) => { if (!p.querySelector('a') && p.textContent.trim()) { const d = document.createElement('p'); d.className = 'card-desc'; d.innerHTML = p.innerHTML; card.append(d); } });
    const link = cell.querySelector('a');
    if (link) { link.classList.add('card-more'); card.append(link); }
    grid.append(card);
  });
  block.replaceChildren(grid);
}
