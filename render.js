// ============================================================
// render.js — Profil Render Motoru
// index.html ve preview.html tarafından kullanılır.
// ============================================================

// ============================================================
// GLOBAL DEĞİŞKENLER
// ============================================================
let audio = null;
let isPlaying = false;
let currentMusicUrl = '';

// ============================================================
// APPLY PROFILE DATA
// ============================================================
function applyProfileData(d) {
    // --- AVATAR ---
    const avatar = document.getElementById('avatar');
    if (avatar) {
        avatar.src = d.avatar && d.avatar.startsWith('http') ? d.avatar : 'https://i.imgur.com/6VBx3io.png';
        avatar.alt = d.name || 'Avatar';
    }

    // --- EMOJİLER ---
    const emojiLeft = document.getElementById('nameEmojiLeft');
    const emojiRight = document.getElementById('nameEmojiRight');
    if (emojiLeft) emojiLeft.textContent = d.emojiLeft || '';
    if (emojiRight) emojiRight.textContent = d.emojiRight || '';

    // --- İSİM ---
    const nameDisplay = document.getElementById('nameDisplay');
    if (nameDisplay) {
        nameDisplay.textContent = d.name || d.username || 'İsimsiz';
        nameDisplay.style.background = d.nameGradient || 'linear-gradient(135deg, #F9FAFB, #9CA3AF)';
        nameDisplay.style.webkitBackgroundClip = 'text';
        nameDisplay.style.webkitTextFillColor = 'transparent';
        nameDisplay.style.backgroundClip = 'text';
        nameDisplay.style.textShadow = d.nameGlow || 'none';
        if (d.nameNeon) {
            nameDisplay.style.textShadow = `0 0 ${d.neonSize || 10}px ${d.neonColor || '#3B82F6'}, 0 0 ${(d.neonSize || 10) * 2}px ${d.neonColor || '#3B82F6'}`;
        }
    }

    // --- EMOJİ 3D ---
    const emoji3d = document.getElementById('emoji3d');
    if (emoji3d) {
        document.querySelectorAll('.name-emoji').forEach(el => {
            el.classList.toggle('d3', d.emoji3d !== false);
        });
    }

    // --- BİO ---
    const bioDisplay = document.getElementById('bioDisplay');
    if (bioDisplay) {
        bioDisplay.textContent = d.bio || '';
    }

    // --- BADGE ---
    const badge = document.getElementById('badge');
    const verifiedLabel = document.getElementById('verifiedLabel');
    if (badge) {
        if (d.showBadge !== false && d.badgeIcon) {
            badge.textContent = d.badgeIcon;
            badge.style.background = d.badgeColor || 'linear-gradient(135deg, #3B82F6, #8B5CF6)';
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
    if (verifiedLabel) {
        if (d.emailVerified) {
            verifiedLabel.classList.remove('hidden');
        } else {
            verifiedLabel.classList.add('hidden');
        }
    }

    // --- ARKA PLAN ---
    const bgVideo = document.getElementById('bgVideo');
    const particles = document.getElementById('particles');
    
    if (d.bgVideo && d.bgVideo.startsWith('http')) {
        if (bgVideo) {
            bgVideo.src = d.bgVideo;
            bgVideo.classList.remove('hidden');
            bgVideo.play().catch(() => {});
        }
        // Video varsa arka plan resmini gizle
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = 'transparent';
    } else if (d.bgImage && d.bgImage.startsWith('http')) {
        if (bgVideo) bgVideo.classList.add('hidden');
        document.body.style.backgroundImage = `url(${d.bgImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundColor = d.bgColor || '#0B0F17';
    } else {
        if (bgVideo) bgVideo.classList.add('hidden');
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = d.bgColor || '#0B0F17';
    }

    // --- PARTİKÜLLER ---
    if (particles) {
        particles.innerHTML = '';
        if (d.particles !== false) {
            const count = d.particleCount || 40;
            const color = d.particleColor || 'rgba(59,130,246,0.3)';
            for (let i = 0; i < count; i++) {
                const p = document.createElement('div');
                p.className = 'particle';
                const size = 2 + Math.random() * 3;
                p.style.width = size + 'px';
                p.style.height = size + 'px';
                p.style.background = color;
                p.style.left = Math.random() * 100 + '%';
                p.style.animationDuration = (8 + Math.random() * 12) + 's';
                p.style.animationDelay = (Math.random() * 10) + 's';
                p.style.opacity = 0.3 + Math.random() * 0.7;
                particles.appendChild(p);
            }
        }
    }

    // --- KART STİLLERİ ---
    const profileCard = document.getElementById('profileCard');
    if (profileCard) {
        const opacity = d.cardOpacity != null ? d.cardOpacity : 0.8;
        const blur = d.cardBlur != null ? d.cardBlur : 20;
        profileCard.style.background = `rgba(17, 24, 39, ${opacity})`;
        profileCard.style.backdropFilter = `blur(${blur}px)`;
        profileCard.style.webkitBackdropFilter = `blur(${blur}px)`;
    }

    // --- YAZI TİPİ ---
    if (d.fontFamily) {
        document.body.style.fontFamily = d.fontFamily + ', system-ui, sans-serif';
    }

    // --- LİNKLER ---
    const linksContainer = document.getElementById('linksContainer');
    if (linksContainer) {
        linksContainer.innerHTML = '';
        const links = d.links || [];
        links.forEach(link => {
            if (!link.url) return;
            const a = document.createElement('a');
            a.className = 'link-btn';
            a.href = link.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            if (d.btnGlow !== false) a.classList.add('glow-active');
            if (d.btnShimmer !== false) a.classList.add('glow-border');
            if (d.btnStyle) a.style.borderRadius = d.btnStyle === 'rounded-full' ? '999px' :
                d.btnStyle === 'rounded-lg' ? '12px' : '0';
            if (d.btnBgColor) a.style.background = d.btnBgColor;
            if (d.btnBorderColor) a.style.borderColor = d.btnBorderColor;
            if (d.btnHoverColor) a.style.setProperty('--hover-bg', d.btnHoverColor);
            if (d.btnHoverBorder) a.style.setProperty('--hover-border', d.btnHoverBorder);

            const icon = document.createElement('span');
            icon.className = 'link-icon';
            icon.textContent = link.icon || '🔗';

            const title = document.createElement('span');
            title.className = 'link-title';
            title.textContent = link.title || link.url;

            const arrow = document.createElement('span');
            arrow.className = 'link-arrow';
            arrow.textContent = '→';

            a.append(icon, title, arrow);
            linksContainer.appendChild(a);
        });
    }

    // --- MÜZİK PLAYER ---
    const musicPlayer = document.getElementById('musicPlayer');
    const musicCover = document.getElementById('musicCover');
    const musicTitle = document.getElementById('musicTitle');
    const musicArtist = document.getElementById('musicArtist');
    const playBtn = document.getElementById('playBtn');

    if (d.musicUrl && d.musicUrl.startsWith('http')) {
        musicPlayer.classList.remove('hidden');
        if (musicCover) musicCover.src = d.musicCover && d.musicCover.startsWith('http') ? d.musicCover : 'https://i.imgur.com/6VBx3io.png';
        if (musicTitle) musicTitle.textContent = d.musicTitle || 'Müzik';
        if (musicArtist) musicArtist.textContent = d.musicArtist || 'Sanatçı';
        musicPlayer.style.opacity = d.musicOpacity || 0.9;
        musicPlayer.style.backdropFilter = `blur(${d.musicBlur || 10}px)`;
        currentMusicUrl = d.musicUrl;
        if (d.musicAutoplay !== false) {
            setTimeout(() => togglePlay(true), 500);
        }
    } else {
        musicPlayer.classList.add('hidden');
    }

    // --- GÖRÜNTÜLENME ---
    const viewCount = document.getElementById('viewCount');
    if (viewCount && d.views !== undefined) {
        viewCount.textContent = d.views;
    }
}

// ============================================================
// MÜZİK KONTROLLERİ
// ============================================================
function togglePlay(forcePlay = false) {
    const playBtn = document.getElementById('playBtn');
    const musicCover = document.getElementById('musicCover');
    
    if (!currentMusicUrl) return;

    if (!audio) {
        audio = new Audio(currentMusicUrl);
        audio.loop = true;
        audio.volume = 0.5;
        audio.addEventListener('ended', () => {
            isPlaying = false;
            if (playBtn) playBtn.textContent = '▶';
            if (musicCover) musicCover.classList.remove('playing');
        });
    }

    if (forcePlay || !isPlaying) {
        audio.play().then(() => {
            isPlaying = true;
            if (playBtn) playBtn.textContent = '⏸';
            if (musicCover) musicCover.classList.add('playing');
        }).catch(err => {
            console.warn('Müzik çalınamadı:', err);
            isPlaying = false;
            if (playBtn) playBtn.textContent = '▶';
            if (musicCover) musicCover.classList.remove('playing');
        });
    } else {
        audio.pause();
        isPlaying = false;
        if (playBtn) playBtn.textContent = '▶';
        if (musicCover) musicCover.classList.remove('playing');
    }
}

// ============================================================
// PREVIEW İÇİN MESAJ DİNLEYİCİSİ
// ============================================================
window.addEventListener('message', (ev) => {
    if (ev.data && ev.data.type === 'profile-preview') {
        const d = ev.data.payload;
        applyProfileData(d);
    }
});

// ============================================================
// SAYFA YÜKLENDİĞİNDE
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Play butonuna tıklama olayı
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        playBtn.addEventListener('click', () => togglePlay());
    }
});

// ============================================================
// CSS EKLEMELER (dinamik hover stilleri)
// ============================================================
const style = document.createElement('style');
style.textContent = `
    .link-btn {
        transition: all 0.3s ease;
    }
    .link-btn:hover {
        background: var(--hover-bg, rgba(255,255,255,0.08)) !important;
        border-color: var(--hover-border, rgba(255,255,255,0.15)) !important;
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);
