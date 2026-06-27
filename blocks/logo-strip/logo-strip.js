/**
 * logo-strip — customer trust logos. Authoring: one cell of <img>s (+ optional
 * leading eyebrow text as default content above the block).
 */
export default function decorate(block) {
  const imgs = [...block.querySelectorAll('img, picture')];
  const grid = document.createElement('div');
  grid.className = 'ls-grid';
  imgs.forEach((im) => { const w = document.createElement('div'); w.className = 'ls-logo'; w.append(im.closest('picture') || im); grid.append(w); });
  block.replaceChildren(grid);
  block.closest('.section')?.classList.add('surface');
}
