/**
 * hero — type-led centered hero. Renders the page <h1>, lede, CTAs.
 * Variant: `confetti` adds the geometric-confetti motif (decorative).
 * Authoring: one cell with <h1>, optional eyebrow <p><strong>, body <p>(s),
 * and a CTA <p> (primary <strong><a>, secondary <em><a>).
 */
function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) { const p = document.createElement('p'); p.textContent = cell.textContent.trim(); out.push(p); }
  });
  return out.length ? out : [...block.children];
}

const CONFETTI = '<div class="hero-confetti" aria-hidden="true"><i class="tri c1"></i><i class="blob c2"></i><i class="tri sm c3"></i><i class="blob dark c4"></i><i class="tri c5"></i><i class="blob c6"></i></div>';

export default function decorate(block) {
  const nodes = collectNodes(block);
  const inner = document.createElement('div');
  inner.className = 'hero-inner';
  nodes.forEach((n) => inner.append(n));
  // ensure exactly one h1 (promote first heading if needed)
  const wrap = document.createElement('div');
  wrap.className = 'hero-wrap';
  if (block.classList.contains('confetti')) wrap.insertAdjacentHTML('afterbegin', CONFETTI);
  wrap.append(inner);
  block.replaceChildren(wrap);
}
