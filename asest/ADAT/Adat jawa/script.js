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
const copyAccountBtn = document.getElementById('copyAccount');
const accountNumber = document.getElementById('accountNumber');
const copyToast = document.getElementById('copyToast');
const guestForm = document.getElementById('guestForm');
const messagesContainer = document.getElementById('messagesContainer');
const messageCount = document.getElementById('messageCount');
const sendGiftBtn = document.getElementById('sendGift');

// ===== VARIABLES =====
let isMusicPlaying = false;
let countdownInterval;

// ===== MUSIC AUTOPLAY =====
function playWeddingMusic() {
    weddingMusic.volume = 0.5;
    weddingMusic.play()
        .then(() => {
            isMusicPlaying = true;
            musicText.textContent = 'Mateni Musik';
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
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '1000',
        padding: '10px 20px',
        borderRadius: '50px',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: '2px solid var(--secondary-color)',
        fontFamily: 'inherit',
        cursor: 'pointer',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        animation: 'fadeInUp 1s ease'
    });
    
    musicPlayBtn.addEventListener('click', () => {
        playWeddingMusic();
        musicPlayBtn.remove();
    });
    
    document.body.appendChild(musicPlayBtn);
}

// ===== COVER SCREEN TRANSITION =====
function openInvitation() {
    coverScreen.classList.add('hide');
    
    playWeddingMusic();
    
    setTimeout(() => {
        mainContent.classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
    
    setTimeout(() => {
        initScrollAnimations();
        initScrollReveal();
    }, 1500);
}

openInvitationBtn.addEventListener('click', openInvitation);

// ===== MUSIC TOGGLE =====
if (toggleMusicBtn) {
    toggleMusicBtn.addEventListener('click', function() {
        if (isMusicPlaying) {
            weddingMusic.pause();
            musicText.textContent = 'Puter Musik';
            isMusicPlaying = false;
        } else {
            weddingMusic.play();
            musicText.textContent = 'Mateni Musik';
            isMusicPlaying = true;
        }
    });
}

// ===== COUNTDOWN TIMER =====
const weddingDate = new Date('2026-02-14T18:00:00+07:00').getTime(); // WIB (GMT+7)

function updateCountdown() {
    const now = new Date().getTime();
    const timeRemaining = weddingDate - now;
    
    if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        countdownDays.textContent = '00';
        countdownHours.textContent = '00';
        countdownMinutes.textContent = '00';
        countdownSeconds.textContent = '00';
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
    
    element.style.transform = 'scale(1.2)';
    element.style.color = 'var(--secondary-color)';
    
    setTimeout(() => {
        if (element) {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }
    }, 300);
}

// ===== COPY ACCOUNT NUMBER =====
if (copyAccountBtn) {
    copyAccountBtn.addEventListener('click', function() {
        const accountNum = accountNumber.textContent;
        
        navigator.clipboard.writeText(accountNum)
            .then(() => {
                showToast('Nomer rekening kasil disalin!');
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
                showToast('Nomer rekening kasil disalin!');
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
    const messages = JSON.parse(localStorage.getItem('weddingGuestMessages')) || [];
    displayMessages(messages);
    updateMessageCount(messages.length);
}

function displayMessages(messages) {
    if (!messagesContainer) return;
    
    if (messages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="no-messages">
                <i class="far fa-comment-alt"></i>
                <p>Dereng wonten ucapan. Dados ingkang sepisanan!</p>
            </div>
        `;
        return;
    }
    
    messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    let messagesHTML = '';
    messages.forEach(msg => {
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
                <div class="message-time">${time} ${msg.attendance ? '• Badhe rawuh' : ''}</div>
                <p class="message-content">${escapeHtml(msg.message)}</p>
            </div>
        `;
    });
    
    messagesContainer.innerHTML = messagesHTML;
    
    setTimeout(() => {
        document.querySelectorAll('.message-item').forEach(item => {
            item.classList.add('visible');
        });
    }, 100);
}

function getRelationText(relation) {
    const relations = {
        'family': 'Keluarga',
        'friend': 'Kanca',
        'colleague': 'Rekan Kerja',
        'other': 'Tamu'
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

if (guestForm) {
    guestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('guestName')?.value.trim() || '';
        const relation = document.getElementById('guestRelation')?.value || 'other';
        const message = document.getElementById('guestMessage')?.value.trim() || '';
        const attendance = document.getElementById('attendance')?.checked || false;
        
        if (!name || !message) {
            alert('Mangga isi nama lan ucapan!');
            return;
        }
        
        const newMessage = {
            id: Date.now(),
            name,
            relation,
            message,
            attendance,
            timestamp: new Date().toISOString()
        };
        
        const messages = JSON.parse(localStorage.getItem('weddingGuestMessages')) || [];
        messages.push(newMessage);
        localStorage.setItem('weddingGuestMessages', JSON.stringify(messages));
        
        displayMessages(messages);
        updateMessageCount(messages.length);
        guestForm.reset();
        showToast('Ucapan kasil dikirim! Matur nuwun.');
        
        setTimeout(() => {
            messagesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    });
}

if (sendGiftBtn) {
    sendGiftBtn.addEventListener('click', function() {
        showToast('Matur nuwun! Konfirmasi hadiah sampun kacathet.');
    });
}

// ===== NAVIGATION DOTS =====
function updateActiveNav() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
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

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(element => observer.observe(element));
}

// ===== SHARE BUTTON =====
const shareBtn = document.querySelector('.btn-share');
if (shareBtn) {
    shareBtn.addEventListener('click', function() {
        const shareData = {
            title: 'Undangan Pernikahan Adat Jawa R.M. Wiranata & R.A. Kartika',
            text: 'Kawula ngundang panjenengan dhateng adicara palakrami R.M. Wiranata & R.A. Kartika.',
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Berhasil dibagikan'))
                .catch(err => console.log('Error sharing:', err));
        } else {
            navigator.clipboard.writeText(window.location.href)
                .then(() => showToast('Link undangan disalin dhateng clipboard!'))
                .catch(err => console.log('Failed to copy URL:', err));
        }
    });
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
            
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            Object.assign(lightbox.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(139,69,19,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '2000',
                cursor: 'pointer',
                animation: 'fadeInUp 0.5s ease'
            });
            
            lightbox.innerHTML = `
                <div style="position: relative; max-width: 90%; max-height: 90%;">
                    <img src="${imgSrc}" alt="${altText}" style="max-width: 100%; max-height: 80vh; border-radius: 10px; border: 5px solid var(--secondary-color); animation: zoomInOut 0.5s ease;">
                    <button class="close-lightbox" style="position: absolute; top: -40px; right: 0; background: none; border: none; color: white; font-size: 2rem; cursor: pointer; transition: transform 0.3s ease;">×</button>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.classList.contains('close-lightbox')) {
                    lightbox.style.animation = 'fadeInUp 0.5s ease reverse';
                    setTimeout(() => {
                        if (lightbox.parentNode) {
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
    const openMapBtns = document.querySelectorAll('.btn-open-map, .btn-direction');
    
    openMapBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://maps.app.goo.gl/TuYqyShgBt4uMbq26', '_blank');
        });
    });
}

// ===== PARTICLE EFFECTS =====
function createParticles() {
    const particles = document.getElementById('particles');
    if (!particles) return;
    
    particles.innerHTML = '';
    
    // Create flower petals (kembang melati)
    for (let i = 0; i < 12; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        Object.assign(petal.style, {
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: `${0.3 + Math.random() * 0.4}`,
            transform: `rotate(${Math.random() * 360}deg)`,
            width: `${10 + Math.random() * 10}px`,
            height: `${10 + Math.random() * 10}px`
        });
        particles.appendChild(petal);
    }
    
    // Create sparkles
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        Object.assign(sparkle.style, {
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            animationDelay: `${Math.random() * 2}s`,
            width: `${3 + Math.random() * 4}px`,
            height: `${3 + Math.random() * 4}px`
        });
        particles.appendChild(sparkle);
    }
}

// ===== FLOATING ANIMATIONS =====
function addFloatingAnimations() {
    const floatingSelectors = [
        '.cover-title',
        '.countdown-number',
        '.closing-couple h3',
        '.section-divider i',
        '.couple-divider i'
    ];
    
    floatingSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (!el.classList.contains('floating')) {
                el.classList.add('floating');
            }
        });
    });
    
    const omSymbols = document.querySelectorAll('.fa-om:not(.beating-heart)');
    omSymbols.forEach(om => {
        om.classList.add('animate__animated', 'animate__heartBeat', 'animate__infinite');
    });
}

// ===== BUTTON ANIMATIONS =====
function initButtonAnimations() {
    navDots.forEach(dot => {
        dot.addEventListener('mouseenter', () => {
            dot.classList.add('animate__animated', 'animate__tada');
        });
        dot.addEventListener('mouseleave', () => {
            setTimeout(() => {
                dot.classList.remove('animate__animated', 'animate__tada');
            }, 1000);
        });
    });
    
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
    // Start countdown
    if (countdownDays && countdownHours && countdownMinutes && countdownSeconds) {
        countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    }
    
    // Load guest messages
    loadGuestMessages();
    
    // Initialize features
    initGalleryLightbox();
    initLocationMaps();
    createParticles();
    addFloatingAnimations();
    initButtonAnimations();
    initScrollReveal();
    
    // Set up scroll events
    window.addEventListener('scroll', updateActiveNav);
    
    // Check for autoplay music
    setTimeout(() => {
        if (weddingMusic.paused && !isMusicPlaying) {
            showMusicPlayButton();
        }
    }, 3000);
    
    // Initial navigation update
    updateActiveNav();
}

// ===== WINDOW LOAD =====
window.addEventListener('load', function() {
    initializeApp();
    
    // Check if cover should be hidden (for direct access)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('open')) {
        openInvitation();
    }
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Space to toggle music
    if (e.code === 'Space' && !e.target.matches('input, textarea, button, a')) {
        e.preventDefault();
        if (toggleMusicBtn) {
            toggleMusicBtn.click();
        }
    }
    
    // Escape to close lightbox
    if (e.code === 'Escape') {
        const lightbox = document.querySelector('.lightbox');
        if (lightbox) {
            lightbox.style.animation = 'fadeInUp 0.5s ease reverse';
            setTimeout(() => {
                if (lightbox.parentNode) {
                    lightbox.parentNode.removeChild(lightbox);
                }
            }, 500);
        }
    }
    
    // Enter to open invitation from cover
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
        createParticles(); // Recreate particles on resize
    }, 250);
});

// ===== PAGE VISIBILITY =====
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause music when tab is not active
        if (isMusicPlaying) {
            weddingMusic.pause();
        }
    } else {
        // Resume music when tab is active
        if (isMusicPlaying) {
            weddingMusic.play().catch(console.error);
        }
    }
});

// ===== OFFLINE SUPPORT =====
window.addEventListener('offline', function() {
    showToast('Panjenengan offline. Sawetara fitur winates.');
});

window.addEventListener('online', function() {
    showToast('Koneksi internet wangsul.');
});

// ===== SERVICE WORKER REGISTRATION (Optional) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// ===== CONSOLE GREETING =====
console.log('%c🎉 Undangan Pernikahan Adat Jawa | R.M. Wiranata & R.A. Kartika 🎉', 'font-size: 18px; color: #8B4513; font-weight: bold;');
console.log('%cDipundamel kanthi ❤️ dening Rekan Wedding', 'font-size: 14px; color: #B8860B;');