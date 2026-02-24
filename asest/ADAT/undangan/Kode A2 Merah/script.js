// ===== DOM ELEMENTS =====
const coverScreen = document.getElementById('coverScreen');
const openBtn = document.getElementById('openInvitation');
const mainContent = document.getElementById('mainContent');
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('toggleMusic');
const musicPlayer = document.getElementById('musicPlayer');
const floatingNav = document.getElementById('floatingNav');
const navDots = document.querySelectorAll('.nav-dot');
const sections = document.querySelectorAll('.section');
const toastContainer = document.getElementById('toastContainer');

// ===== COVER SCREEN =====
// Set background image from data attribute
document.addEventListener('DOMContentLoaded', function() {
    const coverSampul = coverScreen.getAttribute('data-sampul');
    if (coverSampul) {
        coverScreen.style.backgroundImage = `url('${coverSampul}')`;
    }
    
    // Hide main content initially
    mainContent.style.display = 'none';
    document.body.style.overflow = 'hidden';
    
    // Initialize particles after DOM is ready
    initParticles();
});

// ===== OPEN INVITATION =====
openBtn.addEventListener('click', function() {
    // Hide cover screen with animation
    coverScreen.classList.add('hidden');
    
    // Show main content
    setTimeout(() => {
        mainContent.style.display = 'block';
        setTimeout(() => {
            mainContent.classList.add('visible');
        }, 50);
        
        document.body.style.overflow = 'auto';
        
        // Show floating elements
        musicPlayer.classList.add('visible');
        floatingNav.classList.add('visible');
        
        // Play music
        bgMusic.play().catch(error => {
            console.log('Autoplay prevented:', error);
        });
        
        // Initialize scroll reveal after content is visible
        setTimeout(() => {
            initScrollReveal();
            updateActiveNav();
        }, 500);
        
    }, 800);
});

// ===== MUSIC PLAYER =====
let isPlaying = true;

musicIcon.addEventListener('click', function() {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.classList.remove('playing');
    } else {
        bgMusic.play();
        musicIcon.classList.add('playing');
    }
    isPlaying = !isPlaying;
});

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
    const targetDate = new Date('2026-02-14T00:00:00+07:00').getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    animateNumber('days', days);
    animateNumber('hours', hours);
    animateNumber('minutes', minutes);
    animateNumber('seconds', seconds);
}

function animateNumber(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const oldValue = parseInt(element.textContent);
    
    if (oldValue !== newValue) {
        element.classList.add('change');
        element.textContent = newValue.toString().padStart(2, '0');
        
        setTimeout(() => {
            element.classList.remove('change');
        }, 300);
    } else {
        element.textContent = newValue.toString().padStart(2, '0');
    }
}

// Update countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);

// ===== PARTICLES BACKGROUND =====
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 50,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#D4AF37"
                },
                "shape": {
                    "type": "circle"
                },
                "opacity": {
                    "value": 0.3,
                    "random": true
                },
                "size": {
                    "value": 4,
                    "random": true
                },
                "line_linked": {
                    "enable": false
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "bubble"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "resize": true
                },
                "modes": {
                    "bubble": {
                        "distance": 200,
                        "size": 6,
                        "duration": 2,
                        "opacity": 0.5
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    }
                }
            },
            "retina_detect": true
        });
    }
}

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
    const reveals = document.querySelectorAll('.section-header, .couple-card, .event-card, .gallery-item, .closing-card, .guestbook-form, .gift-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px'
    });
    
    reveals.forEach(reveal => {
        reveal.style.opacity = '0';
        reveal.style.transform = 'translateY(30px)';
        reveal.style.transition = 'all 0.8s ease';
        observer.observe(reveal);
    });
}

// ===== ACTIVE NAVIGATION DOTS =====
function updateActiveNav() {
    let currentSection = '';
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-section') === currentSection) {
            dot.classList.add('active');
        }
    });
}

// Smooth scroll for nav dots
navDots.forEach(dot => {
    dot.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('scroll', updateActiveNav);

// ===== GUESTBOOK (LOCAL STORAGE) =====
const guestbookForm = document.getElementById('guestbookForm');
const messagesContainer = document.getElementById('messagesContainer');

// Load messages from localStorage
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('weddingMessages') || '[]');
    
    if (messages.length === 0) {
        messagesContainer.innerHTML = '<p class="text-center text-muted py-4">Belum ada ucapan. Jadilah yang pertama!</p>';
        return;
    }
    
    let html = '';
    messages.slice(0, 10).forEach(msg => {
        const date = new Date(msg.timestamp).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        html += `
            <div class="message-item">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="message-name">${msg.name}</span>
                    <span class="message-date">${date}</span>
                </div>
                <p class="message-content mb-2">${msg.message}</p>
                ${msg.attendance ? '<span class="message-attendance"><i class="fas fa-calendar-check me-1"></i>Akan Hadir</span>' : ''}
            </div>
        `;
    });
    
    messagesContainer.innerHTML = html;
}

// Save message to localStorage
if (guestbookForm) {
    guestbookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('guestName').value.trim();
        const message = document.getElementById('guestMessage').value.trim();
        const attendanceSelect = document.getElementById('guestAttendance');
        const attendance = attendanceSelect.value;
        
        if (!name || !message || !attendance) {
            showToast('Mohon lengkapi semua field', 'error');
            return;
        }
        
        const newMessage = {
            name,
            message,
            attendance: attendance === 'Hadir',
            timestamp: new Date().toISOString()
        };
        
        const messages = JSON.parse(localStorage.getItem('weddingMessages') || '[]');
        messages.unshift(newMessage);
        localStorage.setItem('weddingMessages', JSON.stringify(messages));
        
        // Reset form
        guestbookForm.reset();
        
        // Reload messages
        loadMessages();
        
        // Show success toast
        showToast('Ucapan berhasil dikirim! Terima kasih 🙏', 'success');
    });
}

// Load messages on page load
loadMessages();

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-notification mb-2 ${type}`;
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===== GIFT FUNCTIONS =====
window.copyBank = function() {
    const bankNumber = '1370016077816';
    
    navigator.clipboard.writeText(bankNumber).then(() => {
        showToast('Nomor rekening berhasil disalin!', 'success');
    }).catch(err => {
        showToast('Gagal menyalin nomor rekening', 'error');
    });
};

window.showAddress = function() {
    const addressBox = document.getElementById('addressBox');
    
    if (addressBox.style.display === 'none' || addressBox.style.display === '') {
        addressBox.style.display = 'block';
        addressBox.style.animation = 'fadeInUp 0.5s ease';
    } else {
        addressBox.style.display = 'none';
    }
};

// ===== PRELOAD IMAGES =====
const images = document.querySelectorAll('img[src]');
images.forEach(img => {
    if (img.src && !img.complete) {
        img.style.opacity = '0';
        img.onload = function() {
            this.style.transition = 'opacity 0.5s ease';
            this.style.opacity = '1';
        };
    }
});