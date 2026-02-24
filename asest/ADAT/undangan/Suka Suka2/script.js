// ===== DOM ELEMENTS =====
const coverScreen = document.getElementById('coverScreen');
const mainContent = document.getElementById('mainContent');
const openInvitationBtn = document.getElementById('openInvitation');
const weddingMusic = document.getElementById('weddingMusic');

// Countdown elements
const countdownElements = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
};

// ===== WEDDING DATE (22 January 2024) =====
const weddingDate = new Date('2024-01-22T08:00:00').getTime();

// ===== COVER SCREEN CONTROL =====
openInvitationBtn.addEventListener('click', openInvitation);

function openInvitation() {
    console.log('Membuka undangan...');
    
    // Start music with volume control
    if (weddingMusic) {
        weddingMusic.volume = 0.5;
        weddingMusic.play().catch(error => {
            console.log('Autoplay musik diblokir:', error);
            showMusicPlayPrompt();
        });
    }
    
    // Animate cover exit
    coverScreen.style.opacity = '0';
    coverScreen.style.pointerEvents = 'none';
    
    // Enable scroll immediately
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Show main content with delay
    setTimeout(() => {
        coverScreen.style.display = 'none';
        mainContent.style.display = 'block';
        
        // Trigger reflow for animation
        mainContent.offsetHeight;
        
        mainContent.classList.add('visible');
        mainContent.style.opacity = '1';
        
        // Start features
        startCountdown();
        generateQRCode();
        initGuestbook();
        initEventButtons();
        initGallery();
        initClipboard();
        initScrollAnimations();
        
        console.log('Undangan terbuka!');
    }, 800);
}

// ===== COUNTDOWN SYSTEM =====
function startCountdown() {
    console.log('Memulai countdown...');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            // Wedding day has arrived
            Object.values(countdownElements).forEach(el => {
                el.textContent = '00';
            });
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update display with animation
        updateCountdownElement(countdownElements.days, days);
        updateCountdownElement(countdownElements.hours, hours);
        updateCountdownElement(countdownElements.minutes, minutes);
        updateCountdownElement(countdownElements.seconds, seconds);
    }
    
    function updateCountdownElement(element, value) {
        const formattedValue = value.toString().padStart(2, '0');
        if (element.textContent !== formattedValue) {
            // Add flip animation
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = 'flip 0.6s ease';
                element.textContent = formattedValue;
            }, 10);
        }
    }
    
    // Initial update
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    console.log('Inisialisasi animasi scroll...');
    
    // Add fade-in class to all sections except cover
    const sections = document.querySelectorAll('section:not(#coverScreen)');
    sections.forEach((section, index) => {
        if (!section.classList.contains('fade-in')) {
            section.classList.add('fade-in');
        }
    });
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, entry.target.dataset.delay || 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== GALLERY SYSTEM =====
function initGallery() {
    console.log('Inisialisasi galeri...');
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.querySelector('.gallery-modal');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    
    if (!galleryItems.length || !modal) return;
    
    let currentIndex = 0;
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            openModal();
        });
    });
    
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        // In real implementation, update modal image here
    }
    
    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        // In real implementation, update modal image here
    }
    
    // Event Listeners
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// ===== GIFT SYSTEM =====
function generateQRCode() {
    console.log('Membuat QR Code...');
    
    const qrCanvas = document.getElementById('qrCanvas');
    if (!qrCanvas) return;
    
    const accountNumber = '1234567890123456';
    const qrText = `Bank Central\nA/N: IKE SARI DEWI & BOBY PRATAMA\nNo: ${accountNumber}`;
    
    try {
        QRCode.toCanvas(qrCanvas, qrText, {
            width: 170,
            height: 170,
            margin: 1,
            color: {
                dark: '#072407',
                light: '#FFFFFF'
            }
        }, (error) => {
            if (error) {
                console.error('Error generating QR code:', error);
                showQRCodeFallback(qrCanvas);
            }
        });
    } catch (error) {
        console.error('QR Code library error:', error);
        showQRCodeFallback(qrCanvas);
    }
}

function showQRCodeFallback(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#7A9779';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR Code', canvas.width / 2, canvas.height / 2 - 10);
    
    ctx.font = '14px Arial';
    ctx.fillText('Gunakan nomor rekening', canvas.width / 2, canvas.height / 2 + 20);
}

// ===== CLIPBOARD SYSTEM =====
function initClipboard() {
    console.log('Inisialisasi clipboard...');
    
    const copyBtn = document.getElementById('copyButton');
    const toast = document.getElementById('copyToast');
    const accountNumber = '1234567890123456';
    
    if (!copyBtn || !toast) return;
    
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(accountNumber);
            showToast(toast);
        } catch (err) {
            console.error('Clipboard API error:', err);
            fallbackCopy(accountNumber, toast);
        }
    });
    
    function fallbackCopy(text, toastElement) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast(toastElement);
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    function showToast(toastElement) {
        toastElement.classList.add('show');
        setTimeout(() => {
            toastElement.classList.remove('show');
        }, 3000);
    }
}

// ===== GUESTBOOK SYSTEM =====
function initGuestbook() {
    console.log('Inisialisasi buku tamu...');
    
    const form = document.getElementById('guestForm');
    const guestList = document.getElementById('guestList');
    const loadMoreBtn = document.getElementById('loadMore');
    
    if (!form || !guestList) return;
    
    let currentPage = 1;
    const entriesPerPage = 3;
    
    form.addEventListener('submit', handleGuestSubmit);
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreEntries);
    }
    
    function handleGuestSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('guestName').value.trim();
        const attendance = document.getElementById('guestAttendance').value;
        const message = document.getElementById('guestMessage').value.trim();
        
        if (!name || !attendance || !message) {
            alert('Harap lengkapi semua field!');
            return;
        }
        
        const guestEntry = {
            id: Date.now(),
            name,
            attendance,
            message,
            date: new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
            time: new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        saveGuestEntry(guestEntry);
        displayGuestEntry(guestEntry);
        form.reset();
        showThankYouMessage();
    }
    
    function saveGuestEntry(entry) {
        let entries = JSON.parse(localStorage.getItem('weddingGuestbook')) || [];
        entries.unshift(entry); // Add to beginning
        localStorage.setItem('weddingGuestbook', JSON.stringify(entries));
    }
    
    function displayGuestEntry(entry) {
        // Remove "no guest" message if exists
        const noGuest = guestList.querySelector('.no-guest');
        if (noGuest) {
            noGuest.remove();
        }
        
        const entryElement = createGuestEntryElement(entry);
        guestList.prepend(entryElement);
        
        // Update load more button visibility
        updateLoadMoreButton();
    }
    
    function createGuestEntryElement(entry) {
        const div = document.createElement('div');
        div.className = 'guest-entry fade-in';
        div.dataset.id = entry.id;
        
        const attendanceClass = `attendance-${entry.attendance}`;
        const attendanceText = {
            'hadir': 'Akan Hadir',
            'mungkin': 'Mungkin Hadir',
            'tidak': 'Tidak Hadir'
        }[entry.attendance] || entry.attendance;
        
        div.innerHTML = `
            <div class="guest-header">
                <span class="guest-name">${escapeHtml(entry.name)}</span>
                <span class="guest-attendance ${attendanceClass}">${attendanceText}</span>
            </div>
            <p class="guest-message">${escapeHtml(entry.message)}</p>
            <div class="guest-date">${entry.date} • ${entry.time}</div>
        `;
        
        return div;
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function loadGuestEntries(page = 1) {
        const entries = JSON.parse(localStorage.getItem('weddingGuestbook')) || [];
        const start = (page - 1) * entriesPerPage;
        const end = start + entriesPerPage;
        const pageEntries = entries.slice(start, end);
        
        // Remove "no guest" message if exists
        const noGuest = guestList.querySelector('.no-guest');
        if (noGuest && pageEntries.length > 0) {
            noGuest.remove();
        }
        
        pageEntries.forEach(entry => {
            displayGuestEntry(entry);
        });
        
        updateLoadMoreButton(page, entries.length);
    }
    
    function loadMoreEntries() {
        currentPage++;
        loadGuestEntries(currentPage);
    }
    
    function updateLoadMoreButton(page = currentPage, totalEntries = null) {
        if (!loadMoreBtn) return;
        
        const entries = JSON.parse(localStorage.getItem('weddingGuestbook')) || [];
        const total = totalEntries || entries.length;
        const showing = page * entriesPerPage;
        
        if (showing >= total) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.textContent = `Muat Lebih Banyak (${total - showing} tersisa)`;
        }
    }
    
    function showThankYouMessage() {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-body">
                <i class="fas fa-check-circle"></i> Terima kasih atas ucapan Anda!
            </div>
        `;
        
        const container = document.querySelector('.toast-container') || document.body;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Load initial entries
    loadGuestEntries();
}

// ===== EVENT BUTTONS =====
function initEventButtons() {
    console.log('Inisialisasi tombol event...');
    
    // Event location buttons
    document.querySelectorAll('.btn-event').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const location = e.target.closest('.btn-event').dataset.location;
            if (location) {
                const [lat, lng] = location.split(',').map(Number);
                window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
            }
        });
    });
    
    // Open Maps button
    const openMapsBtn = document.getElementById('openMaps');
    if (openMapsBtn) {
        openMapsBtn.addEventListener('click', () => {
            window.open('https://www.google.com/maps?q=-6.2256,106.8036', '_blank');
        });
    }
    
    // Map overlay click
    const mapOverlay = document.querySelector('.map-overlay');
    if (mapOverlay) {
        mapOverlay.addEventListener('click', () => {
            window.open('https://www.google.com/maps?q=-6.2256,106.8036', '_blank');
        });
    }
}

// ===== MUSIC PROMPT =====
function showMusicPlayPrompt() {
    console.log('Menampilkan prompt musik...');
    
    // Check if prompt already exists
    if (document.querySelector('.music-prompt')) return;
    
    const prompt = document.createElement('div');
    prompt.className = 'music-prompt fade-in';
    prompt.innerHTML = `
        <div class="prompt-content">
            <p><i class="fas fa-music"></i> Musik latar tersedia</p>
            <button id="playMusicBtn" class="btn-play">
                <i class="fas fa-play"></i> Putar Musik
            </button>
        </div>
    `;
    
    document.body.appendChild(prompt);
    
    // Add CSS for music prompt if not already added
    if (!document.querySelector('#musicPromptStyles')) {
        const style = document.createElement('style');
        style.id = 'musicPromptStyles';
        style.textContent = `
            .music-prompt {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: var(--primary-color);
                color: white;
                padding: 20px 25px;
                border-radius: var(--border-radius);
                box-shadow: 0 8px 30px rgba(0,0,0,0.2);
                z-index: 1000;
                transform: translateY(30px);
                opacity: 0;
                transition: all 0.4s ease;
                max-width: 300px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.1);
            }
            
            .music-prompt.visible {
                transform: translateY(0);
                opacity: 1;
            }
            
            .prompt-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
            }
            
            .prompt-content p {
                margin: 0;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 1.1rem;
            }
            
            .btn-play {
                background: white;
                color: var(--primary-color);
                border: none;
                padding: 10px 20px;
                border-radius: 25px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                transition: all 0.3s ease;
                font-size: 1rem;
            }
            
            .btn-play:hover {
                background: var(--light-color);
                transform: scale(1.05);
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            
            @media (max-width: 576px) {
                .music-prompt {
                    left: 20px;
                    right: 20px;
                    bottom: 20px;
                    max-width: none;
                }
                
                .prompt-content {
                    flex-direction: column;
                    text-align: center;
                    gap: 15px;
                }
                
                .btn-play {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Show prompt with animation
    setTimeout(() => {
        prompt.classList.add('visible');
    }, 100);
    
    // Play music button
    document.getElementById('playMusicBtn').addEventListener('click', () => {
        if (weddingMusic) {
            weddingMusic.play().then(() => {
                prompt.classList.remove('visible');
                setTimeout(() => prompt.remove(), 300);
            }).catch(error => {
                console.error('Failed to play music:', error);
                alert('Gagal memutar musik. Pastikan browser Anda mendukung autoplay.');
            });
        }
    });
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (prompt.parentNode) {
            prompt.classList.remove('visible');
            setTimeout(() => {
                if (prompt.parentNode) prompt.remove();
            }, 300);
        }
    }, 10000);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM siap!');
    
    // Disable scroll initially
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Initialize systems that don't need content to be visible
    initClipboard();
    initEventButtons();
    
    // Add fade-in class to sections
    const sections = document.querySelectorAll('section:not(#coverScreen)');
    sections.forEach((section, index) => {
        section.classList.add('fade-in');
        section.dataset.delay = index * 100;
    });
    
    // Start countdown preview on cover screen
    const now = new Date().getTime();
    if (now >= weddingDate) {
        Object.values(countdownElements).forEach(el => {
            if (el) el.textContent = '00';
        });
    }
    
    // Test: Auto-open invitation after 2 seconds (for testing)
    // setTimeout(openInvitation, 2000);
});

// ===== WINDOW RESIZE HANDLER =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reinitialize anything that needs resizing
        console.log('Window resized');
    }, 250);
});

// ===== UTILITY FUNCTIONS =====
function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

// ===== DEBUG HELPER =====
function checkAllElements() {
    const elements = {
        coverScreen: !!document.getElementById('coverScreen'),
        mainContent: !!document.getElementById('mainContent'),
        openInvitationBtn: !!document.getElementById('openInvitation'),
        weddingMusic: !!document.getElementById('weddingMusic'),
        countdownDays: !!document.getElementById('days'),
        countdownHours: !!document.getElementById('hours'),
        countdownMinutes: !!document.getElementById('minutes'),
        countdownSeconds: !!document.getElementById('seconds'),
        guestForm: !!document.getElementById('guestForm'),
        qrCanvas: !!document.getElementById('qrCanvas'),
        copyButton: !!document.getElementById('copyButton')
    };
    
    console.log('Element check:', elements);
    return elements;
}

// Run element check on load
setTimeout(checkAllElements, 1000);