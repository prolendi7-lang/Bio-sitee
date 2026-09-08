// ============================================================
// render.js - Profil Render Motoru (Tam ve Güncel)
// index.html, preview.html, admin.html tarafından kullanılır
// ============================================================

function applyProfileData(data) {
    // ==========================================================
    // 1. TEMEL BİLGİLER
    // ==========================================================

    // AVATAR
    const avatar = document.getElementById('avatar');
    if (avatar) {
        avatar.src = data.avatar || 'https://i.imgur.com/6VBx3io.png';
    }

    // İSİM
    const nameDisplay = document.getElementById('nameDisplay');
    if (nameDisplay) {
        nameDisplay.textContent = data.name || data.username || 'İsimsiz';
        
        // Gradient
        if (data.nameGradient) {
            nameDisplay.style.background = data.nameGradient;
            nameDisplay.style.webkitBackgroundClip = 'text';
            nameDisplay.style.webkitTextFillColor = 'transparent';
            nameDisplay.style.backgroundClip = 'text';
        }
        
        // Glow
        if (data.nameGlow && data.nameGlow !== 'none') {
            nameDisplay.style.textShadow = data.nameGlow;
        } else {
            nameDisplay.style.textShadow = 'none';
        }
        
        // Neon
        if (data.nameNeon) {
            const size = data.neonSize || 10;
            const color = data.neonColor || '#3B82F6';
            nameDisplay.style.textShadow = `
                0 0 ${size}px ${color},
                0 0 ${size * 2}px ${color},
                0 0 ${size * 3}px ${color}
            `;
        }
        
        // Font
        if (data.fontFamily) {
            nameDisplay.style.fontFamily = data.fontFamily;
        }
    }

    // EMOJİLER
    const emojiLeft = document.getElementById('nameEmojiLeft');
    if (emojiLeft) {
        emojiLeft.textContent = data.emojiLeft || '';
        if (data.emoji3d !== false) {
            emojiLeft.classList.add('d3');
        } else {
            emojiLeft.classList.remove('d3');
        }
    }
    
    const emojiRight = document.getElementById('nameEmojiRight');
    if (emojiRight) {
        emojiRight.textContent = data.emojiRight || '';
        if (data.emoji3d !== false) {
            emojiRight.classList.add('d3');
        } else {
            emojiRight.classList.remove('d3');
        }
    }

    // BİO
    const bioDisplay = document.getElementById('bioDisplay');
    if (bioDisplay) {
        bioDisplay.textContent = data.bio || '';
    }

    // ROZET
    const badge = document.getElementById('badge');
    if (badge) {
        if (data.showBadge !== false) {
            badge.classList.remove('hidden');
            badge.textContent = data.badgeIcon || '✓';
            badge.style.background = data.badgeColor || 'linear-gradient(135deg, #3B82F6, #8B5CF6)';
        } else {
            badge.classList.add('hidden');
        }
    }

    // DOĞRULANMIŞ ETİKETİ
    const verifiedLabel = document.getElementById('verifiedLabel');
    if (verifiedLabel) {
        if (data.emailVerified) {
            verifiedLabel.classList.remove('hidden');
        } else {
            verifiedLabel.classList.add('hidden');
        }
    }

    // ==========================================================
    // 2. LİNKLER
    // ==========================================================

    const linksContainer = document.getElementById('linksContainer');
    if (linksContainer) {
        linksContainer.innerHTML = '';
        
        if (data.links && data.links.length > 0) {
            data.links.forEach((link, index) => {
                const a = document.createElement('a');
                a.href = link.url || '#';
                a.target = '_blank';
                a.className = 'link-btn';
                a.dataset.index = index;

                // ---- BUTON ŞEKLİ ----
                const shape = data.btnShape || 'yuvarlak';
                let borderRadius = '9999px';
                if (shape === 'kare') borderRadius = '0';
                else if (shape === 'dikdortgen') borderRadius = '8px';
                else if (shape === 'yumusak') borderRadius = '20px';
                // 'yuvarlak' zaten 9999px
                a.style.borderRadius = borderRadius;

                // ---- BUTON OPASİTESİ ----
                const opacity = data.btnOpacity !== undefined ? parseInt(data.btnOpacity) : 100;
                if (opacity === 0) {
                    a.style.opacity = '0';
                    a.style.pointerEvents = 'none';
                } else {
                    a.style.opacity = opacity / 100;
                    a.style.pointerEvents = 'auto';
                }

                // ---- BUTON RENKLERİ ----
                if (data.btnBgColor) {
                    a.style.background = data.btnBgColor;
                }
                if (data.btnBorderColor) {
                    a.style.borderColor = data.btnBorderColor;
                }
                // Hover renkleri (CSS değişkenleri ile)
                if (data.btnHoverColor) {
                    a.style.setProperty('--hover-bg', data.btnHoverColor);
                }
                if (data.btnHoverBorder) {
                    a.style.setProperty('--hover-border', data.btnHoverBorder);
                }

                // ---- GLOW & SHIMMER ----
                if (data.btnGlow !== false) {
                    a.classList.add('glow-border');
                } else {
                    a.classList.remove('glow-border');
                }
                if (data.btnShimmer !== false) {
                    a.classList.add('glow-active');
                } else {
                    a.classList.remove('glow-active');
                }

                // ---- LOGO (SVG) ----
                const iconSpan = document.createElement('span');
                iconSpan.className = 'link-icon';
                const logo = getPlatformLogo(link.url || '', link.title || '');
                iconSpan.innerHTML = logo;
                a.appendChild(iconSpan);

                // ---- BAŞLIK ----
                const titleSpan = document.createElement('span');
                titleSpan.className = 'link-title';
                titleSpan.textContent = link.title || 'Link';
                a.appendChild(titleSpan);

                // ---- OK ----
                const arrowSpan = document.createElement('span');
                arrowSpan.className = 'link-arrow';
                arrowSpan.textContent = '→';
                a.appendChild(arrowSpan);

                // ---- TIKLANMA SAYACI (isteğe bağlı) ----
                if (link.clicks !== undefined) {
                    const statsSpan = document.createElement('span');
                    statsSpan.className = 'link-stats';
                    statsSpan.textContent = '👁 ' + link.clicks;
                    a.appendChild(statsSpan);
                }

                linksContainer.appendChild(a);
            });
        }
    }

    // ==========================================================
    // 3. MÜZİK ÇALAR
    // ==========================================================

    const musicPlayer = document.getElementById('musicPlayer');
    const audio = document.getElementById('bgMusic');
    const joinOverlay = document.getElementById('joinOverlay');

    if (musicPlayer && audio) {
        if (data.musicUrl) {
            musicPlayer.classList.remove('hidden');
            
            // Müzik bilgileri
            document.getElementById('musicTitle').textContent = data.musicTitle || 'Müzik';
            document.getElementById('musicArtist').textContent = data.musicArtist || 'Sanatçı';
            document.getElementById('musicCover').src = data.musicCover || 'https://i.imgur.com/6VBx3io.png';
            
            // Play butonunu gizle (artık yok)
            const playBtn = document.getElementById('playBtn');
            if (playBtn) playBtn.style.display = 'none';
            
            // Opaklık ve blur
            musicPlayer.style.opacity = data.musicOpacity || 0.9;
            musicPlayer.style.backdropFilter = `blur(${data.musicBlur || 10}px)`;
            musicPlayer.style.webkitBackdropFilter = `blur(${data.musicBlur || 10}px)`;
            
            // Audio kaynağını set et
            audio.src = data.musicUrl;
            audio.load();
            
            // Overlay kontrolü (Click to Join)
            if (joinOverlay) {
                if (data.musicAutoplay !== false) {
                    joinOverlay.style.display = 'flex';
                } else {
                    joinOverlay.style.display = 'none';
                    // Otomatik çalma kapalıysa direkt başlat
                    audio.play().catch(() => {});
                }
            }
        } else {
            musicPlayer.classList.add('hidden');
            if (joinOverlay) joinOverlay.style.display = 'none';
            audio.src = '';
        }
    }

    // ==========================================================
    // 4. ARKA PLAN
    // ==========================================================

    // Renk
    if (data.bgColor) {
        document.body.style.backgroundColor = data.bgColor;
    }

    // Resim
    if (data.bgImage) {
        document.body.style.backgroundImage = `url(${data.bgImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    } else {
        document.body.style.backgroundImage = '';
    }

    // Video
    const bgVideo = document.getElementById('bgVideo');
    if (bgVideo) {
        if (data.bgVideo) {
            bgVideo.src = data.bgVideo;
            bgVideo.classList.remove('hidden');
            bgVideo.play().catch(() => {});
        } else {
            bgVideo.classList.add('hidden');
            bgVideo.src = '';
        }
    }

    // ==========================================================
    // 5. PARTİKÜLLER
    // ==========================================================

    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        
        if (data.particles !== false && data.particleCount > 0) {
            const color = data.particleColor || 'rgba(59,130,246,0.3)';
            const count = data.particleCount || 40;
            
            for (let i = 0; i < count; i++) {
                const p = document.createElement('div');
                p.className = 'particle';
                const size = Math.random() * 4 + 2;
                p.style.width = size + 'px';
                p.style.height = size + 'px';
                p.style.background = color;
                p.style.left = Math.random() * 100 + '%';
                p.style.animationDuration = (Math.random() * 15 + 10) + 's';
                p.style.animationDelay = (Math.random() * 20) + 's';
                particlesContainer.appendChild(p);
            }
        }
    }

    // ==========================================================
    // 6. KART SAYDAMLIK & BLUR
    // ==========================================================

    const card = document.querySelector('.profile-card');
    if (card) {
        const opacity = data.cardOpacity !== undefined ? data.cardOpacity : 0.8;
        const blur = data.cardBlur !== undefined ? data.cardBlur : 20;
        
        card.style.background = `rgba(17, 24, 39, ${opacity})`;
        card.style.backdropFilter = `blur(${blur}px)`;
        card.style.webkitBackdropFilter = `blur(${blur}px)`;
    }

    // ==========================================================
    // 7. GÖRÜNTÜLENME SAYACI
    // ==========================================================

    const viewCount = document.getElementById('viewCount');
    if (viewCount && data.views !== undefined) {
        viewCount.textContent = data.views || 0;
    }
}


// ============================================================
// PLATFORM LOGOLARI (GERÇEK SVG)
// ============================================================

function getPlatformLogo(url, title) {
    const u = url.toLowerCase();
    const t = title.toLowerCase();

    // YouTube
    if (u.includes('youtube.com') || u.includes('youtu.be')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;
    }
    
    // Instagram
    if (u.includes('instagram.com')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E4405F" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>`;
    }
    
    // TikTok
    if (u.includes('tiktok.com')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000000"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.3-.7.32-1.08.07-2.37.02-4.74.02-7.12 0-2.43.01-4.86.02-7.29z"/></svg>`;
    }
    
    // Twitter/X
    if (u.includes('twitter.com') || u.includes('x.com')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
    }
    
    // GitHub
    if (u.includes('github.com')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#181717"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.399s2.04.132 3 .399c2.292-1.552 3.3-1.23 3.3-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.694.825.577C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`;
    }
    
    // Discord
    if (u.includes('discord.com') || u.includes('discord.gg')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`;
    }
    
    // Twitch
    if (u.includes('twitch.tv')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#9146FF"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>`;
    }
    
    // Spotify
    if (u.includes('spotify.com')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719.9.42 1.441-.3.42-.899.6-1.381.3z"/></svg>`;
    }
    
    // Telegram
    if (u.includes('telegram.org') || u.includes('t.me')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#26A5E4"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`;
    }
    
    // Steam
    if (u.includes('steamcommunity.com')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000000"><path d="M11.5 0C5.149 0 0 5.149 0 11.5c0 4.87 3.027 9.044 7.333 10.708l2.758-2.758c.47.138.96.218 1.467.218 6.351 0 11.5-5.149 11.5-11.5S17.851 0 11.5 0zm0 19.5c-1.482 0-2.835-.414-4.012-1.128l3.784-3.784c.153-.153.192-.381.102-.583a2.698 2.698 0 0 1-.114-.39 2.893 2.893 0 0 1-.004-.194c0-1.573 1.273-2.846 2.846-2.846 1.28 0 2.363.844 2.739 2.005a2.714 2.714 0 0 1 .44.062l3.288-3.288c-.041-.891-.239-1.74-.589-2.509-.814-1.79-2.305-3.19-4.125-3.978-1.82-.789-3.851-.988-5.812-.573-1.961.415-3.68 1.421-4.93 2.887-1.25 1.466-2.006 3.287-2.166 5.216-.156 1.93.247 3.858 1.151 5.548l-2.607 2.607C2.928 17.303 1 14.683 1 11.5 1 5.71 5.71 1 11.5 1S22 5.71 22 11.5 17.29 22 11.5 22z"/></svg>`;
    }
    
    // WhatsApp
    if (u.includes('whatsapp.com')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
    }
    
    // LinkedIn
    if (u.includes('linkedin.com')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
    }
    
    // Facebook
    if (u.includes('facebook.com')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
    }
    
    // Varsayılan: küresel simgesi
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
}
