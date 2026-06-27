/**
 * form-embed — contact / demo-request. The source forms post to a third-party
 * (HubSpot/WP). For the migration we render the intro copy + a CTA linking to the
 * live form, plus the contact details. Authoring: cell with copy + a CTA <a>.
 * (A real embedded form can be wired later via an iframe authored in the cell.)
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block;
  const iframe = cell.querySelector('iframe');
  const wrap = document.createElement('div');
  wrap.className = 'fe-wrap';
  if (iframe) { wrap.classList.add('fe-has-frame'); wrap.append(iframe); } else { wrap.append(...cell.childNodes); }
  block.replaceChildren(wrap);
}
