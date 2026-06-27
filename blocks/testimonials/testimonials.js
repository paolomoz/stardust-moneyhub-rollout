/**
 * testimonials — quote grid. Authoring: one row per quote, cell holds the quote
 * text and an attribution. Convention: <blockquote> or first <p> = quote;
 * a trailing <p> with <strong> = name, rest = role. Section head authored as
 * default content above the block.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'tm-grid';
  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    const fig = document.createElement('figure');
    fig.className = 'tm-quote';
    const ps = [...cell.querySelectorAll('p, blockquote')];
    const quoteEl = ps.find((p) => p.tagName === 'BLOCKQUOTE') || ps[0];
    const who = ps[ps.length - 1] !== quoteEl ? ps[ps.length - 1] : null;
    const bq = document.createElement('blockquote');
    if (quoteEl) bq.innerHTML = quoteEl.innerHTML;
    fig.append(bq);
    if (who) { const cap = document.createElement('figcaption'); cap.className = 'tm-who'; cap.innerHTML = who.innerHTML; fig.append(cap); }
    grid.append(fig);
  });
  block.replaceChildren(grid);
  block.closest('.section')?.classList.add('surface');
  if (rows.length === 1) grid.classList.add('single');
}
