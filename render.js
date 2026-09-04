import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYPnmrNRq3UGOafII08CY8kOYiTBnfzOo",
  authDomain: "rolex-bio-ede79.firebaseapp.com",
  projectId: "rolex-bio-ede79",
  storageBucket: "rolex-bio-ede79.firebasestorage.app",
  messagingSenderId: "197084877208",
  appId: "1:197084877208:web:1f2de252e4e86376f0dbed",
  measurementId: "G-4B5V7W16WE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
/* render.js — Tek kaynak: hem herkese açık profil sayfası hem de
   admin panelindeki canlı önizleme AYNI bu fonksiyonu kullanır.
   Böylece "önizlemede gördüğün = ziyaretçinin gördüğü" garanti edilir
   ve kullanıcı verisi hiçbir zaman innerHTML ile basılmaz (XSS koruması). */

const FONT_MAP = {
    'system':    { family: "'Segoe UI', system-ui, -apple-system, sans-serif", google: null },
    'poppins':   { family: "'Poppins', sans-serif", google: 'Poppins:wght@400;600;700' },
    'montserrat':{ family: "'Montserrat', sans-serif", google: 'Montserrat:wght@400;600;700' },
    'playfair':  { family: "'Playfair Display', serif", google: 'Playfair+Display:wght@400;700' },
    'bebas':     { family: "'Bebas Neue', sans-serif", google: 'Bebas+Neue' },
    'pacifico':  { family: "'Pacifico', cursive", google: 'Pacifico' },
    'mono':      { family: "'Roboto Mono', monospace", google: 'Roboto+Mono:wght@400;600' }
};

function loadGoogleFont(googleParam) {
    if (!googleParam) return;
    let link = document.getElementById('dynamicFontLink');
    if (!link) {
        link = document.createElement('link');
        link.id = 'dynamicFontLink';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
    const href = `https://fonts.googleapis.com/css2?family=${googleParam}&display=swap`;
    if (link.getAttribute('href') !== href) link.href = href;
}

function safeUrl(url) {
    if (!url) return '';
    try {
        const u = new URL(String(url), window.location.href);
        if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
    } catch (e) { /* geçersiz url */ }
    return '';
}

function safeFont(name) {
    const allowed = ['Poppins', 'Montserrat', 'Playfair Display', 'Space Grotesk', 'DM Sans', 'Bebas Neue', 'Caveat', 'Roboto Mono'];
    return allowed.includes(name) ? name : '';
}

function applyProfileData(d) {
    d = d || {};

    document.getElementById('nameDisplay').textContent = d.name || 'İsimsiz';
    document.getElementById('bioDisplay').textContent = d.bio || '';
    document.getElementById('avatar').src = safeUrl(d.avatar) || 'https://i.imgur.com/6VBx3io.png';
    document.title = (d.name || 'Bio') + ' | Bio';

    document.body.style.fontFamily = safeFont(d.fontFamily)
        ? `'${safeFont(d.fontFamily)}', 'Segoe UI', sans-serif`
        : "'Segoe UI', system-ui, -apple-system, sans-serif";

    const el = document.getElementById('nameEmojiLeft');
    const er = document.getElementById('nameEmojiRight');
    el.textContent = d.emojiLeft || '';
    er.textContent = d.emojiRight || '';
    el.className = 'name-emoji' + (d.emoji3d ? ' d3' : '');
    er.className = 'name-emoji' + (d.emoji3d ? ' d3' : '');

    const badge = document.getElementById('badge');
    if (d.showBadge === false) {
        badge.classList.add('hidden');
    } else {
        badge.classList.remove('hidden');
        badge.textContent = d.badgeIcon || '✓';
        badge.style.background = d.badgeColor || 'linear-gradient(135deg, #1da1f2, #0d8bd9)';
    }

    const card = document.getElementById('profileCard');
    card.style.background = `rgba(20,20,20,${d.cardOpacity != null ? d.cardOpacity : 0.85})`;
    card.style.backdropFilter = `blur(${d.cardBlur != null ? d.cardBlur : 20}px)`;
    card.style.webkitBackdropFilter = `blur(${d.cardBlur != null ? d.cardBlur : 20}px)`;

    const nameEl = document.getElementById('nameDisplay');
    nameEl.style.background = d.nameGradient || 'linear-gradient(135deg, #ffffff, #cccccc)';
    nameEl.style.webkitBackgroundClip = 'text';
    nameEl.style.webkitTextFillColor = 'transparent';
    nameEl.style.backgroundClip = 'text';
    nameEl.style.textShadow = d.nameGlow || 'none';
    nameEl.style.filter = d.nameNeon ? `drop-shadow(0 0 ${d.neonSize || 10}px ${d.neonColor || '#fff'})` : 'none';

    const fontDef = FONT_MAP[d.fontKey] || FONT_MAP.system;
    if (fontDef.google) loadGoogleFont(fontDef.google);
    const cardEl = document.getElementById('profileCard');
    cardEl.style.fontFamily = fontDef.family;

    const verifiedLabel = document.getElementById('verifiedLabel');
    if (verifiedLabel) verifiedLabel.classList.toggle('hidden', !d.emailVerified);

    const bgVideoEl = document.getElementById('bgVideo');
    const videoUrl = safeUrl(d.bgVideo);
    if (bgVideoEl) {
        if (videoUrl) {
            if (bgVideoEl.getAttribute('src') !== videoUrl) bgVideoEl.setAttribute('src', videoUrl);
            bgVideoEl.classList.remove('hidden');
            bgVideoEl.play().catch(() => {});
        } else {
            bgVideoEl.pause();
            bgVideoEl.removeAttribute('src');
            bgVideoEl.classList.add('hidden');
        }
    }

    const bgImg = safeUrl(d.bgImage);
    document.body.style.background = bgImg ? `url(${bgImg}) center/cover no-repeat fixed` : (d.bgColor || '#0a0a0a');
    document.body.style.backgroundColor = d.bgColor || '#0a0a0a';

    // Arka plan videosu (kısa döngü, sessiz, otomatik oynatma)
    const bgVideoEl = document.getElementById('bgVideo');
    if (bgVideoEl) {
        const videoUrl = safeUrl(d.bgVideo);
        if (videoUrl) {
            if (bgVideoEl.dataset.src !== videoUrl) {
                bgVideoEl.src = videoUrl;
                bgVideoEl.dataset.src = videoUrl;
            }
            bgVideoEl.classList.remove('hidden');
            bgVideoEl.play().catch(() => {});
        } else {
            bgVideoEl.classList.add('hidden');
            bgVideoEl.pause();
            bgVideoEl.removeAttribute('src');
            bgVideoEl.dataset.src = '';
        }
    }

    const pc = document.getElementById('particles');
    pc.innerHTML = '';
    if (d.particles !== false) {
        const count = Math.max(0, Math.min(150, d.particleCount || 40));
        const color = d.particleColor || 'rgba(255,255,255,0.5)';
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (Math.random() * 10 + 5) + 's';
            p.style.animationDelay = Math.random() * 5 + 's';
            p.style.background = color;
            pc.appendChild(p);
        }
    }

    // Linkler — DOM ile inşa edilir, kullanıcı metni hiçbir zaman HTML olarak yorumlanmaz
    const lc = document.getElementById('linksContainer');
    lc.innerHTML = '';
    const btnGlow = d.btnGlow !== false;
    const btnShimmer = d.btnShimmer !== false;
    if (d.links && d.links.length > 0) {
        d.links.forEach(link => {
            const safeHref = safeUrl(link.url);
            const a = document.createElement('a');
            a.href = safeHref || '#';
            if (safeHref) a.target = '_blank';
            a.rel = 'noopener noreferrer nofollow';
            a.className = 'link-btn';
            if (btnGlow) a.classList.add('glow-border');
            if (btnShimmer) a.classList.add('glow-active');
            if (d.btnBgColor) a.style.background = d.btnBgColor;
            if (d.btnBorderColor) a.style.borderColor = d.btnBorderColor;
            if (d.btnHoverColor) {
                a.onmouseenter = () => { a.style.background = d.btnHoverColor; a.style.borderColor = d.btnHoverBorder || d.btnHoverColor; };
                a.onmouseleave = () => { a.style.background = d.btnBgColor || 'rgba(255,255,255,0.05)'; a.style.borderColor = d.btnBorderColor || 'rgba(255,255,255,0.12)'; };
            }
            const iconSpan = document.createElement('span');
            iconSpan.className = 'link-icon';
            iconSpan.textContent = link.icon || '🔗';
            const titleSpan = document.createElement('span');
            titleSpan.className = 'link-title';
            titleSpan.textContent = link.title || '';
            const arrowSpan = document.createElement('span');
            arrowSpan.className = 'link-arrow';
            arrowSpan.textContent = '→';
            a.append(iconSpan, titleSpan, arrowSpan);
            lc.appendChild(a);
        });
    } else {
        const empty = document.createElement('div');
        empty.className = 'link-btn';
        empty.style.justifyContent = 'center';
        empty.style.opacity = '0.5';
        empty.textContent = 'Henüz link eklenmedi';
        lc.appendChild(empty);
    }

    // Müzik
    const mp = document.getElementById('musicPlayer');
    const audio = document.getElementById('bgMusic');
    const musicUrl = safeUrl(d.musicUrl);
    if (musicUrl) {
        mp.classList.remove('hidden');
        mp.style.background = `rgba(20,20,20,${d.musicOpacity != null ? d.musicOpacity : 0.9})`;
        mp.style.backdropFilter = `blur(${d.musicBlur != null ? d.musicBlur : 10}px)`;
        mp.style.webkitBackdropFilter = `blur(${d.musicBlur != null ? d.musicBlur : 10}px)`;
        document.getElementById('musicTitle').textContent = d.musicTitle || 'Müzik';
        document.getElementById('musicArtist').textContent = d.musicArtist || '';
        document.getElementById('musicCover').src = safeUrl(d.musicCover) || 'https://i.imgur.com/6VBx3io.png';
        if (audio.src !== musicUrl) audio.src = musicUrl;
        audio.volume = 0.5;
        if (d.musicAutoplay !== false) {
            audio.play().catch(() => {});
            document.getElementById('playBtn').textContent = '⏸';
            document.getElementById('musicCover').classList.add('playing');
        } else {
            document.getElementById('playBtn').textContent = '▶';
        }
    } else {
        mp.classList.add('hidden');
        audio.pause();
        audio.removeAttribute('src');
    }
}

function togglePlay() {
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('playBtn');
    const cover = document.getElementById('musicCover');
    if (audio.paused) {
        audio.play(); btn.textContent = '⏸'; cover.classList.add('playing');
    } else {
        audio.pause(); btn.textContent = '▶'; cover.classList.remove('playing');
    }
}
