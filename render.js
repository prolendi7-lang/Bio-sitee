/* ============================================================
   render.js — Tek kaynak profil render motoru
   XSS güvenli, DOM ile inşa eder, innerHTML kullanılmaz.
   ============================================================ */

// ============================================================
// FONT MAP
// ============================================================
const FONT_MAP = {
    '': { family: "'Inter', system-ui, -apple-system, sans-serif", google: null },
    'poppins': { family: "'Poppins', sans-serif", google: 'Poppins:wght@400;600;700' },
    'montserrat': { family: "'Montserrat', sans-serif", google: 'Montserrat:wght@400;600;700' },
    'playfair': { family: "'Playfair Display', serif", google: 'Playfair+Display:wght@600;700' },
    'space grotesk': { family: "'Space Grotesk', sans-serif", google: 'Space+Grotesk:wght@400;600;700' },
    'dm sans': { family: "'DM Sans', sans-serif", google: 'DM+Sans:wght@400;600;700' },
    'bebas neue': { family: "'Bebas Neue', sans-serif", google: 'Bebas+Neue' },
    'caveat': { family: "'Caveat', cursive", google: 'Caveat:wght@600' },
    'roboto mono': { family: "'Roboto Mono', monospace", google: 'Roboto+Mono:wght@400;600' }
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

// ============================================================
// SAFE HELPERS
// ============================================================
function safeUrl(url) {
    if (!url) return '';
    try {
        const u = new URL(String(url), window.location.href);
        if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
    } catch (e) {}
    return '';
}

function safeFont(name) {
    const allowed = ['Poppins', 'Montserrat', 'Playfair Display', 'Space Grotesk', 'DM Sans', 'Bebas Neue', 'Caveat',
        'Roboto Mono'
    ];
    return allowed.includes(name) ? name : '';
}

// ============================================================
// MAIN RENDER FUNCTION
// ============================================================
function applyProfileData(d) {
    d = d || {};

    // ---- NAME ----
    document.getElementById('nameDisplay').textContent = d.name || 'İsimsiz';

    // ---- BIO ----
    document.getElementById('bioDisplay').textContent = d.bio || '';

    // ---- AVATAR ----
    document.getElementById('avatar').src = safeUrl(d.avatar) || 'https://i.imgur.com/6VBx3io.png';

    // ---- TITLE ----
    document.title = (d.name || 'Bio') + ' | Bio';

    // ---- FONT ----
    const fontKey = (d.fontFamily || '').toLowerCase();
    const fontDef = FONT_MAP[fontKey] || FONT_MAP[''];
    if (fontDef.google) loadGoogleFont(fontDef.google);
    document.body.style.fontFamily = fontDef.family;

    // ---- EMOJIS ----
    const el = document.getElementById('nameEmojiLeft');
    const er = document.getElementById('nameEmojiRight');
    el.textContent = d.emojiLeft || '';
    er.textContent = d.emojiRight || '';
    el.className = 'name-emoji' + (d.emoji3d ? ' d3' : '');
    er.className = 'name-emoji' + (d.emoji3d ? ' d3' : '');

    // ---- BADGE ----
    const badge = document.getElementById('badge');
    if (d.showBadge === false) {
        badge.classList.add('hidden');
    } else {
        badge.classList.remove('hidden');
        badge.textContent = d.badgeIcon || '✓';
        badge.style.background = d.badgeColor || 'linear-gradient(135deg, #3B82F6, #8B5CF6)';
    }

    // ---- CARD ----
    const card = document.getElementById('profileCard');
    card.style.background = `rgba(17, 24, 39, ${d.cardOpacity != null ? d.cardOpacity : 0.8})`;
    card.style.backdropFilter = `blur(${d.cardBlur != null ? d.cardBlur : 20}px)`;
    card.style.webkitBackdropFilter = `blur(${d.cardBlur != null ? d.cardBlur : 20}px)`;

    // ---- NAME EFFECTS ----
    const nameEl = document.getElementById('nameDisplay');
    nameEl.style.background = d.nameGradient || 'linear-gradient(135deg, #F9FAFB, #9CA3AF)';
    nameEl.style.webkitBackgroundClip = 'text';
    nameEl.style.webkitTextFillColor = 'transparent';
    nameEl.style.backgroundClip = 'text';
    nameEl.style.textShadow = d.nameGlow || 'none';
    nameEl.style.filter = d.nameNeon ? `drop-shadow(0 0 ${d.neonSize || 10}px ${d.neonColor || '#3B82F6'})` : 'none';

    // ---- VERIFIED LABEL ----
    const verifiedLabel = document.getElementById('verifiedLabel');
    if (verifiedLabel) verifiedLabel.classList.toggle('hidden', !d.emailVerified);

    // ---- BACKGROUND VIDEO ----
    const bgVideoEl = document.getElementById('bgVideo');
    if (bgVideoEl) {
        const videoUrl = safeUrl(d.bgVideo);
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

    // ---- BACKGROUND & PARTICLES ----
    const bgImg = safeUrl(d.bgImage);
    document.body.style.background = bgImg ? `url(${bgImg}) center/cover no-repeat fixed` : (d.bgColor || '#0B0F17');
    document.body.style.backgroundColor = d.bgColor || '#0B0F17';

    const pc = document.getElementById('particles');
    if (pc) {
        pc.innerHTML = '';
        if (d.particles !== false) {
            const count = Math.max(0, Math.min(150, d.particleCount || 40));
            const color = d.particleColor || 'rgba(59,130,246,0.3)';
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
    }

    // ---- LINKS ----
    const lc = document.getElementById('linksContainer');
    lc.innerHTML = '';
    const btnGlow = d.btnGlow !== false;
    const btnShimmer = d.btnShimmer !== false;
    const btnStyle = d.btnStyle || 'rounded-full';

    const styleMap = {
        'rounded-full': 'border-radius:999px;',
        'rounded-xl': 'border-radius:12px;',
        'rounded-lg': 'border-radius:8px;',
        'rounded-none': 'border-radius:0;'
    };

    if (d.links && d.links.length > 0) {
        d.links.forEach(link => {
            const safeHref = safeUrl(link.url);
            const a = document.createElement('a');
            a.href = safeHref || '#';
            if (safeHref) a.target = '_blank';
            a.rel = 'noopener noreferrer nofollow';
            a.className = 'link-btn';
            a.style.cssText = styleMap[btnStyle] || styleMap['rounded-full'];

            if (btnGlow) a.classList.add('glow-border');
            if (btnShimmer) a.classList.add('glow-active');

            if (d.btnBgColor) a.style.background = d.btnBgColor;
            if (d.btnBorderColor) a.style.borderColor = d.btnBorderColor;

            if (d.btnHoverColor) {
                a.onmouseenter = () => {
                    a.style.background = d.btnHoverColor;
                    a.style.borderColor = d.btnHoverBorder || d.btnHoverColor;
                };
                a.onmouseleave = () => {
                    a.style.background = d.btnBgColor || 'rgba(255,255,255,0.04)';
                    a.style.borderColor = d.btnBorderColor || 'rgba(255,255,255,0.08)';
                };
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
        empty.style.cssText += 'cursor:default;';
        empty.textContent = 'Henüz link eklenmedi';
        lc.appendChild(empty);
    }

    // ---- MUSIC ----
    const mp = document.getElementById('musicPlayer');
    const audio = document.getElementById('bgMusic');
    const musicUrl = safeUrl(d.musicUrl);

    if (musicUrl) {
        mp.classList.remove('hidden');
        mp.style.background = `rgba(17, 24, 39, ${d.musicOpacity != null ? d.musicOpacity : 0.9})`;
        mp.style.backdropFilter = `blur(${d.musicBlur != null ? d.musicBlur : 10}px)`;
        mp.style.webkitBackdropFilter = `blur(${d.musicBlur != null ? d.musicBlur : 10}px)`;

        document.getElementById('musicTitle').textContent = d.musicTitle || 'Müzik';
        document.getElementById('musicArtist').textContent = d.musicArtist || '';
        document.getElementById('musicCover').src = safeUrl(d.musicCover) || 'https://i.imgur.com/6VBx3io.png';

        if (audio.src !== musicUrl) audio.src = musicUrl;
        audio.volume = 0.5;

        // Önizleme modunda (preview.html) otomatik çalmayı engelle
        const isPreview = window.location.pathname.includes('preview.html');
        const shouldAutoplay = d.musicAutoplay !== false && !isPreview;

        if (shouldAutoplay) {
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

// ============================================================
// MUSIC TOGGLE (global)
// ============================================================
function togglePlay() {
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('playBtn');
    const cover = document.getElementById('musicCover');
    if (audio.paused) {
        audio.play();
        btn.textContent = '⏸';
        cover.classList.add('playing');
    } else {
        audio.pause();
        btn.textContent = '▶';
        cover.classList.remove('playing');
    }
}
