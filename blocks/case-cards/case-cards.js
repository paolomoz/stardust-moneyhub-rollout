/**
 * case-cards — horizontal scroll-snap carousel of story cards.
 * Authoring: one row per card; cell holds optional <img> (thumb), a tag <p><em>
 * or first short <p>, an <h3> title wrapped in <a>, and a link.
 * Section head (title + "view all") authored as default content above.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const rail = document.createElement('div');
  rail.className = 'cc-rail';
  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    const link = cell.querySelector('a');
    const href = link ? link.getAttribute('href') : '#';
    const card = document.createElement('a');
    card.className = 'cc-card';
    card.href = href;
    const img = cell.querySelector('picture, img');
    if (img) card.append(img.closest('picture') || img);
    const body = document.createElement('div');
    body.className = 'cc-body';
    const tag = cell.querySelector('em');
    if (tag) { const t = document.createElement('span'); t.className = 'cc-tag'; t.textContent = tag.textContent; body.append(t); }
    const h = cell.querySelector('h2,h3,h4');
    if (h) { const h3 = document.createElement('h3'); h3.textContent = h.textContent; body.append(h3); }
    const more = document.createElement('span'); more.className = 'cc-more'; more.textContent = 'Read more →'; body.append(more);
    card.append(body);
    rail.append(card);
  });
  block.replaceChildren(rail);
}
