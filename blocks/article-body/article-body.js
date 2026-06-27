/**
 * article-body — long-form prose. Renders authored content (h2/h3/p/ul/ol/
 * blockquote) into a readable measure column. One cell of flowing content.
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block;
  const prose = document.createElement('div');
  prose.className = 'ab-prose';
  prose.append(...cell.childNodes);
  block.replaceChildren(prose);
}
