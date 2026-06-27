/**
 * cta-band — centered heading + CTA row. Variants: `slate` (dark bg), `confetti`.
 * Authoring: one cell with <h2> and a CTA <p> (primary <strong><a>, secondary <em><a>).
 */
const CONFETTI = '<div class="cb-confetti" aria-hidden="true"><i class="tri c1"></i><i class="blob c2"></i><i class="blob dark c4"></i><i class="tri c5"></i></div>';

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const inner = document.createElement('div');
  inner.className = 'cb-inner';
  cells.forEach((c) => { if (c.childNodes.length) inner.append(...c.childNodes); });
  if (block.classList.contains('confetti')) inner.insertAdjacentHTML('afterbegin', CONFETTI);
  if (block.classList.contains('slate')) block.closest('.section')?.classList.add('dark');
  block.replaceChildren(inner);
}
