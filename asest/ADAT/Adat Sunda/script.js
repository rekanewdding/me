// ===== DOM ELEMENTS =====
const coverScreen = document.getElementById('cover-screen');
const mainContent = document.getElementById('main-content');
const openInvitationBtn = document.getElementById('open-invitation');
const weddingMusic = document.getElementById('wedding-music');
const toggleMusicBtn = document.getElementById('toggleMusic');
const musicText = document.getElementById('musicText');
const navDots = document.querySelectorAll('.nav-dot');
const sections = document.querySelectorAll('section');
const countdownDays = document.getElementById('days');
const countdownHours = document.getElementById('hours');
const countdownMinutes = document.getElementById('minutes');
const countdownSeconds = document.getElementById('seconds');
const copyAccountBtns = document.querySelectorAll('.btn-copy');
const accountNumbers = document.querySelectorAll('.number');
const copyToast = document.getElementById('copyToast');
const guestForm = document.getElementById('guestForm');
const messagesContainer = document.getElementById('messagesContainer');
const messageCount = document.getElementById('messageCount');
const sendGiftBtn = document.getElementById('sendGift');
const fabMain = document.getElementById('mainFab');
const fabMusic = document.getElementById('fabMusic');
const fabShare = document.getElementById('fabShare');
const filterBtns = document.querySelectorAll('.filter-btn');
const captchaQuestion = document.getElementById('captchaQuestion');
const captchaAnswer = document.getElementById('captchaAnswer');

// ===== VARIABLES =====
let isMusicPlaying = false;
let countdownInterval;
let currentCaptcha = 0;
let currentFilter = 'all';

// ===== INITIALIZE CAPTCHA =====
function generateCaptcha() {
    if (!captchaQuestion) return;
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    currentCaptcha = num1 + num2;
    captchaQuestion.textContent = `${num1} + ${num2} = ?`;
}

// ===== MUSIC AUTOPLAY =====
function playWeddingMusic() {
    if (!weddingMusic) return;
    weddingMusic.volume = 0.5;
    weddingMusic.play()
        .then(() => {
            isMusicPlaying = true;
            if (musicText) musicText.textContent = 'Pareuman Musik';
            if (fabMusic) fabMusic.innerHTML = '<i class="fas fa-pause"></i>';
            console.log('Music started playing');
        })
        .catch(error => {
            console.log('Autoplay prevented:', error);
            showMusicPlayButton();
        });
}

function showMusicPlayButton() {
    const existingBtn = document.querySelector('.music-play-overlay');
    if (existingBtn) return;
    
    const musicPlayBtn = document.createElement('button');
    musicPlayBtn.className = 'btn-play-music music-play-overlay';
    musicPlayBtn.innerHTML = '<i class="fas fa-play"></i> Puter Musik';
    Object.assign(musicPlayBtn.style, {
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '1000',
        padding: '12px 25px',
        borderRadius: '60px',
        backgroundColor: 'var(--sunda-green)',
        color: 'white',
        border: '2px solid var(--sunda-gold)',
        fontFamily: 'inherit',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        animation: 'fadeInUp 1s ease',
        fontSize: '1.1rem'
    });
    
    musicPlayBtn.addEventListener('click', () => {
        playWeddingMusic();
        musicPlayBtn.remove();
    });
    
    document.body.appendChild(musicPlayBtn);
}

// ===== COVER SCREEN TRANSITION =====
function openInvitation() {
    if (!coverScreen || !mainContent) return;
    coverScreen.classList.add('hide');
    
    playWeddingMusic();
    
    setTimeout(() => {
        mainContent.classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
    
    setTimeout(() => {
        initScrollAnimations();
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 1500);
    
    setTimeout(() => {
        document.querySelectorAll('.fab').forEach(fab => {
            fab.classList.add('show');
        });
    }, 2000);
}

if (openInvitationBtn) {
    openInvitationBtn.addEventListener('click', openInvitation);
}

// ===== MUSIC TOGGLE =====
function toggleMusic() {
    if (!weddingMusic) return;
    if (isMusicPlaying) {
        weddingMusic.pause();
        if (musicText) musicText.textContent = 'Puter Musik';
        if (fabMusic) fabMusic.innerHTML = '<i class="fas fa-play"></i>';
        isMusicPlaying = false;
    } else {
        weddingMusic.play();
        if (musicText) musicText.textContent = 'Pareuman Musik';
        if (fabMusic) fabMusic.innerHTML = '<i class="fas fa-pause"></i>';
        isMusicPlaying = true;
    }
}

if (toggleMusicBtn) {
    toggleMusicBtn.addEventListener('click', toggleMusic);
}

if (fabMusic) {
    fabMusic.addEventListener('click', toggleMusic);
}

// ===== FLOATING ACTION BUTTON =====
if (fabMain) {
    fabMain.addEventListener('click', function() {
        this.classList.toggle('active');
        const icon = this.querySelector('i');
        if (icon) {
            if (icon.classList.contains('fa-plus')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-times');
                document.querySelectorAll('.fab:not(.main-fab)').forEach(fab => {
                    fab.style.transform = 'scale(1)';
                    fab.style.opacity = '1';
                });
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-plus');
                document.querySelectorAll('.fab:not(.main-fab)').forEach(fab => {
                    fab.style.transform = 'scale(0)';
                    fab.style.opacity = '0';
                });
            }
        }
    });
}

if (fabShare) {
    fabShare.addEventListener('click', function() {
        shareInvitation();
    });
}

// ===== COUNTDOWN TIMER =====
const weddingDate = new Date('2026-02-14T10:00:00+07:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const timeRemaining = weddingDate - now;
    
    if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        if (countdownDays) countdownDays.textContent = '00';
        if (countdownHours) countdownHours.textContent = '00';
        if (countdownMinutes) countdownMinutes.textContent = '00';
        if (countdownSeconds) countdownSeconds.textContent = '00';
        return;
    }
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    const formatNumber = (num) => num.toString().padStart(2, '0');
    
    animateNumber(countdownDays, formatNumber(days));
    animateNumber(countdownHours, formatNumber(hours));
    animateNumber(countdownMinutes, formatNumber(minutes));
    animateNumber(countdownSeconds, formatNumber(seconds));
}

function animateNumber(element, newValue) {
    if (!element || element.textContent === newValue) return;
    
    element.style.transform = 'scale(1.3)';
    element.style.color = 'var(--sunda-gold)';
    element.style.textShadow = '0 0 20px var(--sunda-gold)';
    
    setTimeout(() => {
        if (element) {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
            element.style.color = '';
            element.style.textShadow = '';
        }
    }, 300);
}

// ===== COPY ACCOUNT NUMBER =====
if (copyAccountBtns.length > 0) {
    copyAccountBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const accountNum = this.previousElementSibling ? this.previousElementSibling.textContent.trim() : '';
            if (!accountNum) return;
            
            navigator.clipboard.writeText(accountNum)
                .then(() => {
                    showToast('Rekening hasil disalin!');
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-check';
                        setTimeout(() => {
                            icon.className = 'far fa-copy';
                        }, 2000);
                    }
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    const textArea = document.createElement('textarea');
                    textArea.value = accountNum;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showToast('Rekening hasil disalin!');
                });
        });
    });
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
    if (!copyToast) return;
    
    const toastText = copyToast.querySelector('span');
    if (toastText) {
        toastText.textContent = message;
    }
    
    copyToast.classList.add('show');
    
    setTimeout(() => {
        copyToast.classList.remove('show');
    }, 3000);
}

// ===== GUESTBOOK =====
function loadGuestMessages() {
    const messages = JSON.parse(localStorage.getItem('sundaWeddingMessages')) || [];
    displayMessages(messages);
    updateMessageCount(messages.length);
}

function displayMessages(messages, filter = 'all') {
    if (!messagesContainer) return;
    
    let filteredMessages = messages;
    if (filter === 'hadir') {
        filteredMessages = messages.filter(msg => msg.attendance);
    }
    
    if (filteredMessages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="no-messages">
                <i class="far fa-smile-wink"></i>
                <p>Can aya pesen. Janten nu pangheulana!</p>
            </div>
        `;
        return;
    }
    
    filteredMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    let messagesHTML = '';
    filteredMessages.forEach(msg => {
        const time = new Date(msg.timestamp).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messagesHTML += `
            <div class="message-item fade-in">
                <div class="message-header">
                    <span class="message-name">${escapeHtml(msg.name)}</span>
                    <span class="message-relation">${getRelationText(msg.relation)}</span>
                </div>
                <div class="message-time">
                    <i class="far fa-clock"></i> ${time}
                    ${msg.city ? `• ${escapeHtml(msg.city)}` : ''}
                </div>
                <p class="message-content">"${escapeHtml(msg.message)}"</p>
                ${msg.attendance ? '<div class="message-attendance"><i class="fas fa-check-circle"></i> Insya Allah bade hadir</div>' : ''}
            </div>
        `;
    });
    
    messagesContainer.innerHTML = messagesHTML;
}

function getRelationText(relation) {
    const relations = {
        'family': 'Kulawarga',
        'friend': 'Babaturan',
        'colleague': 'Réréncangan Gawé',
        'neighbor': 'Tatangga',
        'other': 'Séjénna'
    };
    return relations[relation] || 'Tamu';
}

function updateMessageCount(count) {
    if (messageCount) {
        messageCount.textContent = count;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            const messages = JSON.parse(localStorage.getItem('sundaWeddingMessages')) || [];
            displayMessages(messages, currentFilter);
        });
    });
}

if (guestForm) {
    guestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const captchaAnswerValue = captchaAnswer ? parseInt(captchaAnswer.value) || 0 : 0;
        if (captchaAnswerValue !== currentCaptcha) {
            alert('Captcha salah! Coba deui.');
            generateCaptcha();
            return;
        }
        
        const name = document.getElementById('guestName')?.value.trim() || '';
        const phone = document.getElementById('guestPhone')?.value.trim() || '';
        const relation = document.getElementById('guestRelation')?.value || 'other';
        const city = document.getElementById('guestCity')?.value.trim() || '';
        const message = document.getElementById('guestMessage')?.value.trim() || '';
        const attendance = document.getElementById('attendance')?.checked || false;
        
        if (!name || !message) {
            alert('Nami sareng pesen kedah dieusian!');
            return;
        }
        
        const newMessage = {
            id: Date.now(),
            name,
            phone,
            relation,
            city,
            message,
            attendance,
            timestamp: new Date().toISOString()
        };
        
        const messages = JSON.parse(localStorage.getItem('sundaWeddingMessages')) || [];
        messages.push(newMessage);
        localStorage.setItem('sundaWeddingMessages', JSON.stringify(messages));
        
        displayMessages(messages, currentFilter);
        updateMessageCount(messages.length);
        guestForm.reset();
        generateCaptcha();
        showToast('Pesen hasil dikirim! Hatur nuhun.');
        
        setTimeout(() => {
            if (messagesContainer) {
                messagesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 500);
    });
}

if (sendGiftBtn) {
    sendGiftBtn.addEventListener('click', function() {
        const phone = '6281234567890';
        const message = encodeURIComponent('Halo, abdi bade ngonfirmasi seserahan kanggo nikahan Aa Usep & Neng Yuli');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    });
}

// ===== NAVIGATION DOTS =====
function updateActiveNav() {
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        if (!section) return;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navDots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('data-section') === sectionId) {
                    dot.classList.add('active');
                }
            });
        }
    });
}

navDots.forEach(dot => {
    dot.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        
        if (section) {
            window.scrollTo({
                top: section.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkScroll() {
        fadeElements.forEach(element => {
            if (!element) return;
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    checkScroll();
    window.addEventListener('scroll', checkScroll);
}

// ===== SHARE INVITATION =====
function shareInvitation() {
    const shareData = {
        title: 'Undangan Nikah Sunda - Aa Usep & Neng Yuli',
        text: 'Sampurasun! Punten dihapunten, neda widi ka sadayana. Sim kuring ngondang ka acara pernikahan putra-putri abdi.',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Berhasil dibagikan'))
            .catch(err => console.log('Error sharing:', err));
    } else {
        navigator.clipboard.writeText(window.location.href)
            .then(() => showToast('Link undangan disalin!'))
            .catch(err => console.log('Failed to copy URL:', err));
    }
}

const shareBtn = document.querySelector('.btn-share');
if (shareBtn) {
    shareBtn.addEventListener('click', shareInvitation);
}

// ===== GALLERY LIGHTBOX =====
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (!img) return;
            
            const imgSrc = img.src;
            const altText = img.alt;
            const captionElement = this.querySelector('.gallery-caption p');
            const caption = captionElement ? captionElement.textContent : '';
            
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            Object.assign(lightbox.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(27, 77, 62, 0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '9999',
                cursor: 'pointer',
                animation: 'fadeIn 0.5s ease'
            });
            
            lightbox.innerHTML = `
                <div style="position: relative; max-width: 90%; max-height: 90%;">
                    <img src="${imgSrc}" alt="${altText}" style="max-width: 100%; max-height: 80vh; border-radius: 20px; border: 5px solid var(--sunda-gold); box-shadow: 0 30px 60px rgba(0,0,0,0.5);">
                    <div style="text-align: center; margin-top: 1rem; color: white; font-size: 1.2rem;">${caption}</div>
                    <button class="close-lightbox" style="position: absolute; top: -50px; right: 0; background: none; border: none; color: white; font-size: 3rem; cursor: pointer; transition: transform 0.3s ease;">×</button>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.classList.contains('close-lightbox')) {
                    lightbox.style.animation = 'fadeOut 0.5s ease';
                    setTimeout(() => {
                        if (lightbox.parentNode) {
                            document.body.style.overflow = '';
                            lightbox.parentNode.removeChild(lightbox);
                        }
                    }, 500);
                }
            });
        });
    });
}

// ===== LOCATION MAPS =====
function initLocationMaps() {
    const openMapBtns = document.querySelectorAll('.btn-location-primary, .btn-event-direction, .btn-direction');
    
    openMapBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const mapsUrl = 'https://maps.app.goo.gl/TuYqyShgBt4uMbq26';
            window.open(mapsUrl, '_blank');
        });
    });
}

// ===== PARTICLE EFFECTS =====
function createParticles() {
    const particles = document.getElementById('particles');
    if (!particles) return;
    
    particles.innerHTML = '';
    
    for (let i = 0; i < 15; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        Object.assign(petal.style, {
            position: 'absolute',
            left: `${Math.random() * 100}vw`,
            top: `-50px`,
            width: `${15 + Math.random() * 15}px`,
            height: `${15 + Math.random() * 15}px`,
            background: 'linear-gradient(135deg, #fff, #f8f4e9)',
            borderRadius: '50% 0 50% 50%',
            opacity: `${0.3 + Math.random() * 0.3}`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `petalFall ${15 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
            zIndex: '-1'
        });
        particles.appendChild(petal);
    }
    
    for (let i = 0; i < 25; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        Object.assign(sparkle.style, {
            position: 'absolute',
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            width: `${3 + Math.random() * 5}px`,
            height: `${3 + Math.random() * 5}px`,
            background: 'var(--sunda-gold)',
            borderRadius: '50%',
            boxShadow: '0 0 15px var(--sunda-gold)',
            animation: `twinkle ${2 + Math.random() * 3}s infinite`,
            animationDelay: `${Math.random() * 2}s`,
            zIndex: '-1'
        });
        particles.appendChild(sparkle);
    }
}

// Add keyframe animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes petalFall {
        0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
        10% { opacity: 0.7; }
        90% { opacity: 0.7; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.3); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===== FLOATING ANIMATIONS =====
function addFloatingAnimations() {
    const floatingSelectors = [
        '.cover-title',
        '.countdown-number',
        '.closing-couple h3',
        '.section-divider i',
        '.couple-divider i',
        '.event-icon',
        '.prosesi-number'
    ];
    
    floatingSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el && !el.classList.contains('floating')) {
                el.classList.add('floating');
            }
        });
    });
}

// ===== BUTTON ANIMATIONS =====
function initButtonAnimations() {
    document.addEventListener('click', (e) => {
        const button = e.target.closest('button') || e.target.closest('a.btn');
        if (button) {
            button.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                button.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        }
    });
}

// ===== INITIALIZE EVERYTHING =====
function initializeApp() {
    if (typeof generateCaptcha === 'function') {
        generateCaptcha();
    }
    
    if (countdownDays && countdownHours && countdownMinutes && countdownSeconds) {
        countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    }
    
    loadGuestMessages();
    
    initGalleryLightbox();
    initLocationMaps();
    createParticles();
    addFloatingAnimations();
    initButtonAnimations();
    
    window.addEventListener('scroll', updateActiveNav);
    
    setTimeout(() => {
        if (weddingMusic && weddingMusic.paused && !isMusicPlaying) {
            showMusicPlayButton();
        }
    }, 3000);
    
    updateActiveNav();
    
    const nonMainFabs = document.querySelectorAll('.fab:not(.main-fab)');
    nonMainFabs.forEach(fab => {
        fab.style.transform = 'scale(0)';
        fab.style.opacity = '0';
    });
}

// ===== WINDOW LOAD =====
window.addEventListener('load', function() {
    initializeApp();
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('open')) {
        openInvitation();
    }
    
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 1500);
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !e.target.matches('input, textarea, button, a')) {
        e.preventDefault();
        toggleMusic();
    }
    
    if (e.code === 'Escape') {
        const lightbox = document.querySelector('.lightbox');
        if (lightbox) {
            lightbox.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                if (lightbox.parentNode) {
                    document.body.style.overflow = '';
                    lightbox.parentNode.removeChild(lightbox);
                }
            }, 500);
        }
    }
    
    if (e.code === 'Enter' && coverScreen && !coverScreen.classList.contains('hide')) {
        openInvitation();
    }
});

// ===== RESIZE HANDLER =====
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateCountdown();
        createParticles();
        
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 250);
});

// ===== PAGE VISIBILITY =====
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        if (isMusicPlaying && weddingMusic) {
            weddingMusic.pause();
        }
    } else {
        if (isMusicPlaying && weddingMusic) {
            weddingMusic.play().catch(console.error);
        }
    }
});

// ===== OFFLINE SUPPORT =====
window.addEventListener('offline', function() {
    showToast('Anjeun nuju offline. Sababaraha fitur tiasa terbatas.');
});

window.addEventListener('online', function() {
    showToast('Koneksi internet balik deui.');
});

// ===== CONSOLE GREETING =====
console.log('%c🎉 Undangan Nikah Sunda | Aa Usep & Neng Yuli 🎉', 'font-size: 20px; color: #1B4D3E; font-weight: bold;');
console.log('%cDibuat ku ❤️ sareng Rekan Wedding', 'font-size: 16px; color: #D4AF37;');

const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);