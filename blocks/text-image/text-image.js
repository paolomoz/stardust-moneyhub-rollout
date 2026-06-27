/**
 * text-image — split image+text row. Variants: `dark` (slate bg), `media-left`.
 * Authoring: cell A = copy (h2, p(s), CTA), cell B = <img>.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const cells = rows.flatMap((r) => [...r.children]);
  const mediaCell = cells.find((c) => c.querySelector('picture, img'));
  const copyCell = cells.find((c) => c !== mediaCell && c.textContent.trim());

  const grid = document.createElement('div');
  grid.className = 'ti-grid';

  const copy = document.createElement('div');
  copy.className = 'ti-copy';
  if (copyCell) copy.append(...copyCell.childNodes);

  const media = document.createElement('div');
  media.className = 'ti-media';
  const pic = mediaCell && (mediaCell.matches('picture, img') ? mediaCell : mediaCell.querySelector('picture, img'));
  if (pic) media.append(pic.closest('picture') || pic);

  if (block.classList.contains('media-left')) { grid.append(media, copy); } else { grid.append(copy, media); }
  if (!pic) grid.classList.add('no-media');
  // propagate dark variant to the full-bleed section wrapper
  if (block.classList.contains('dark')) block.closest('.section')?.classList.add('dark');
  block.replaceChildren(grid);
}
