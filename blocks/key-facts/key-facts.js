/**
 * key-facts — stat/feature cards (e.g. "62%" + description). One row per fact;
 * cell holds a short <h3> (the stat/label) and a <p> (description).
 * Section head as default content above.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'kf-grid';
  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    const kf = document.createElement('div');
    kf.className = 'kf';
    const h = cell.querySelector('h2,h3,h4,strong');
    if (h) { const h3 = document.createElement('h3'); h3.textContent = h.textContent; kf.append(h3); }
    cell.querySelectorAll('p').forEach((p) => { if (p.textContent.trim() && p.querySelector('strong') === null) { const d = document.createElement('p'); d.innerHTML = p.innerHTML; kf.append(d); } });
    grid.append(kf);
  });
  block.replaceChildren(grid);
  block.closest('.section')?.classList.add('surface');
}
