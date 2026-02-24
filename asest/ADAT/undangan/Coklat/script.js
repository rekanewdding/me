// DOM Elements
const coverScreen = document.getElementById('cover-screen');
const mainContent = document.getElementById('main-content');
const openInvitationBtn = document.getElementById('open-invitation');
const weddingMusic = document.getElementById('wedding-music');
const toggleMusicBtn = document.getElementById('toggleMusic');
const musicText = document.getElementById('musicText');
const navDots = document.querySelectorAll('.nav-dot');
const sections = document.querySelectorAll('.section');
const copyAccountBtn = document.getElementById('copyAccount');
const accountNumber = document.getElementById('accountNumber');
const copyToast = document.getElementById('copyToast');
const toastContainer = document.getElementById('toastContainer');
const guestForm = document.getElementById('guestForm');
const messagesContainer = document.getElementById('messagesContainer');
const messageCount = document.getElementById('messageCount');
const shareButton = document.getElementById('shareButton');

// Countdown Elements
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');

// Target Date: February 14, 2026
const targetDate = new Date('2026-02-14T00:00:00+07:00').getTime();

// Initialize Music
let isMusicPlaying = true;

// Initialize Particles
function initParticles() {
    const particles = document.getElementById('particles');
    
    // Create flower petals
    for (let i = 0; i < 12; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.animationDelay = `${Math.random() * 10}s`;
        petal.style.width = `${15 + Math.random() * 15}px`;
        petal.style.height = petal.style.width;
        petal.style.opacity = `${0.3 + Math.random() * 0.4}`;
        petal.style.background = `linear-gradient(45deg, 
            rgba(${201 + Math.random() * 40}, ${169 + Math.random() * 40}, ${130 + Math.random() * 40}, 0.8),
            rgba(${139 + Math.random() * 40}, ${115 + Math.random() * 40}, ${85 + Math.random() * 40}, 0.8)
        )`;
        particles.appendChild(petal);
    }
}

// Open Invitation Handler
function openInvitation() {
    // Fade out cover screen
    coverScreen.classList.add('hidden');
    
    // Fade in main content
    setTimeout(() => {
        mainContent.classList.add('visible');
        coverScreen.style.display = 'none';
        
        // Start music
        weddingMusic.play().catch(e => {
            console.log('Autoplay prevented:', e);
            musicText.textContent = 'Putar Musik';
            isMusicPlaying = false;
        });
        
        // Initialize scroll animations
        initScrollReveal();
        updateActiveNavDot();
        
        // Start countdown
        updateCountdown();
        setInterval(updateCountdown, 1000);
        
        // Load guest messages
        loadGuestMessages();
    }, 600);
}

// Music Control
function toggleMusic() {
    if (isMusicPlaying) {
        weddingMusic.pause();
        musicText.textContent = 'Putar Musik';
        toggleMusicBtn.innerHTML = '<i class="fas fa-music"></i> <span id="musicText">Putar Musik</span>';
    } else {
        weddingMusic.play();
        musicText.textContent = 'Matikan Musik';
        toggleMusicBtn.innerHTML = '<i class="fas fa-music"></i> <span id="musicText">Matikan Musik</span>';
    }
    isMusicPlaying = !isMusicPlaying;
}

// Countdown Timer
function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
        daysElement.textContent = '00';
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Add animation for number change
    animateNumberChange(daysElement, days);
    animateNumberChange(hoursElement, hours);
    animateNumberChange(minutesElement, minutes);
    animateNumberChange(secondsElement, seconds);
}

function animateNumberChange(element, newValue) {
    const oldValue = parseInt(element.textContent);
    if (oldValue !== newValue) {
        element.style.transform = 'scale(1.2)';
        element.style.color = '#ff6b6b';
        
        setTimeout(() => {
            element.textContent = newValue.toString().padStart(2, '0');
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 150);
    }
}

// Copy Account Number
function copyToClipboard() {
    const text = accountNumber.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        showToast('Nomor rekening berhasil disalin!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Gagal menyalin nomor rekening');
    });
}

function showToast(message) {
    const toast = copyToast.cloneNode(true);
    toast.querySelector('span').textContent = message;
    toast.classList.remove('show');
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Guestbook Functions
function saveGuestMessage(message) {
    let messages = JSON.parse(localStorage.getItem('weddingGuestMessages') || '[]');
    messages.unshift(message);
    localStorage.setItem('weddingGuestMessages', JSON.stringify(messages));
    loadGuestMessages();
}

function loadGuestMessages() {
    const messages = JSON.parse(localStorage.getItem('weddingGuestMessages') || '[]');
    messageCount.textContent = messages.length;
    
    if (messages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="no-messages">
                <i class="far fa-comment-alt"></i>
                <p>Belum ada ucapan. Jadilah yang pertama!</p>
            </div>
        `;
        return;
    }
    
    let messagesHTML = '';
    messages.forEach(msg => {
        const date = new Date(msg.timestamp).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messagesHTML += `
            <div class="message-item">
                <div class="message-header">
                    <div class="message-name">
                        <i class="fas fa-user"></i> ${msg.name}
                        <span class="message-relation">${getRelationText(msg.relation)}</span>
                    </div>
                    <div class="message-date">${date}</div>
                </div>
                <div class="message-content">${msg.message}</div>
                ${msg.attendance ? '<span class="message-attendance"><i class="fas fa-calendar-check"></i> Akan hadir</span>' : ''}
            </div>
        `;
    });
    
    messagesContainer.innerHTML = messagesHTML;
}

function getRelationText(relation) {
    const relations = {
        'family': 'Keluarga',
        'friend': 'Teman',
        'colleague': 'Rekan Kerja',
        'other': 'Tamu'
    };
    return relations[relation] || 'Tamu';
}

// Scroll Animations
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .fade-in-stagger-1, .fade-in-stagger-2, .fade-in-stagger-3, .fade-in-stagger-4');
    
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

// Navigation Dots
function updateActiveNavDot() {
    let currentSection = '';
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    navDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-section') === currentSection) {
            dot.classList.add('active');
        }
    });
}

// Share Functionality
function shareInvitation() {
    const shareData = {
        title: 'Undangan Pernikahan Alvin & Rindi',
        text: 'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i pada acara pernikahan putra-putri kami.',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Berbagi berhasil'))
            .catch(err => console.log('Berbagi dibatalkan:', err));
    } else {
        // Fallback: Copy URL to clipboard
        navigator.clipboard.writeText(window.location.href)
            .then(() => showToast('Link undangan berhasil disalin!'))
            .catch(err => console.error('Gagal menyalin:', err));
    }
}

// Mobile Optimization
function optimizeForMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) return;
    
    // Adjust animation speeds
    const floatingElements = document.querySelectorAll('.floating');
    floatingElements.forEach(el => {
        el.style.animationDuration = '4s';
    });
    
    // Fix iOS 100vh issue
    function fixVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        const coverScreen = document.getElementById('cover-screen');
        if (coverScreen) {
            coverScreen.style.height = `calc(var(--vh, 1vh) * 100)`;
        }
    }
    
    fixVH();
    window.addEventListener('resize', fixVH);
    window.addEventListener('orientationchange', fixVH);
    
    // Disable particles on low-end devices
    if (/Android|iPhone|iPad/.test(navigator.userAgent)) {
        const particles = document.getElementById('particles');
        if (particles) {
            particles.style.display = 'none';
        }
    }
    
    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.fontSize = '16px';
        });
    });
}

// Event Listeners
openInvitationBtn.addEventListener('click', openInvitation);
toggleMusicBtn.addEventListener('click', toggleMusic);
copyAccountBtn.addEventListener('click', copyToClipboard);
shareButton.addEventListener('click', shareInvitation);

window.addEventListener('scroll', updateActiveNavDot);

guestForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('guestName').value;
    const relation = document.getElementById('guestRelation').value;
    const message = document.getElementById('guestMessage').value;
    const attendance = document.getElementById('attendance').checked;
    
    const guestMessage = {
        name,
        relation,
        message,
        attendance,
        timestamp: new Date().toISOString()
    };
    
    saveGuestMessage(guestMessage);
    
    // Reset form
    guestForm.reset();
    
    // Show success message
    showToast('Ucapan berhasil dikirim!');
});

// Navigation dots click
navDots.forEach(dot => {
    dot.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize Everything
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    optimizeForMobile();
    
    // Auto-open for testing (remove in production)
    // setTimeout(openInvitation, 1000);
});