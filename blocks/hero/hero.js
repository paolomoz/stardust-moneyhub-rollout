/**
 * hero — type-led centered hero. Renders the page <h1>, lede, CTAs.
 * Variant: `confetti` adds the geometric-confetti motif (decorative).
 * Background video: if the block content contains a link to an HLS manifest
 * (`.m3u8`), it is mounted as an autoplaying, muted, looping background video
 * (desktop/tablet only, suppressed under prefers-reduced-motion). The confetti
 * stays as the graceful fallback when video is absent, blocked, or reduced.
 * Authoring: one cell with <h1>, optional eyebrow <p><strong>, body <p>(s),
 * a CTA <p> (primary <strong><a>, secondary <em><a>), and an optional
 * <p><a href="…video.m3u8">…</a></p> for the background video.
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

function loadHls() {
  return new Promise((resolve, reject) => {
    if (window.Hls) { resolve(window.Hls); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/hls.js@1';
    s.onload = () => resolve(window.Hls);
    s.onerror = reject;
    document.head.append(s);
  });
}

async function mountVideo(wrap, src) {
  const layer = document.createElement('div');
  layer.className = 'hero-video-layer';
  layer.setAttribute('aria-hidden', 'true');
  const v = document.createElement('video');
  v.className = 'hero-video';
  v.muted = true; v.loop = true; v.autoplay = true; v.tabIndex = -1;
  v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
  layer.append(v);
  wrap.insertAdjacentElement('afterbegin', layer);
  const play = () => v.play().catch(() => {});
  if (v.canPlayType('application/vnd.apple.mpegurl')) {
    v.src = src; v.addEventListener('loadedmetadata', play); play();
    return;
  }
  try {
    const Hls = await loadHls();
    if (Hls && Hls.isSupported()) {
      const hls = new Hls({ capLevelToPlayerSize: true });
      hls.loadSource(src); hls.attachMedia(v);
      hls.on(Hls.Events.MANIFEST_PARSED, play);
    } else { v.src = src; play(); }
    wrap.classList.add('has-video');
  } catch { /* leave confetti fallback */ }
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  const inner = document.createElement('div');
  inner.className = 'hero-inner';
  nodes.forEach((n) => inner.append(n));
  // extract optional background-video manifest link, remove it from view
  let videoSrc = '';
  const vLink = [...inner.querySelectorAll('a')].find((a) => /\.m3u8(\?|$)/i.test(a.getAttribute('href') || ''));
  if (vLink) { videoSrc = vLink.getAttribute('href'); (vLink.closest('p') || vLink).remove(); }

  const wrap = document.createElement('div');
  wrap.className = 'hero-wrap';
  if (block.classList.contains('confetti')) wrap.insertAdjacentHTML('afterbegin', CONFETTI);
  wrap.append(inner);
  block.replaceChildren(wrap);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wideEnough = window.matchMedia('(min-width: 600px)').matches;
  if (videoSrc && !reduce && wideEnough) mountVideo(wrap, videoSrc);
}
