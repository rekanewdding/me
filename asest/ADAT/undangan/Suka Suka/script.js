// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const openBtn = document.getElementById('openBtn');
    const mainContent = document.getElementById('mainContent');
    const coverSection = document.getElementById('cover');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    const musicText = document.getElementById('musicText');
    const weddingMusic = document.getElementById('weddingMusic');
    const rsvpForm = document.getElementById('rsvpForm');
    const confirmedGuests = document.getElementById('confirmedGuests');
    const totalGuests = document.getElementById('totalGuests');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // Countdown target date (Feb 29, 2026)
    const weddingDate = new Date('Feb 29, 2026 08:00:00').getTime();
    
    // Initialize counters
    let confirmedCount = 87;
    let totalCount = 120;
    let isMusicPlaying = false;
    
    // Update counter displays
    confirmedGuests.textContent = confirmedCount;
    totalGuests.textContent = totalCount;
    
    // Open invitation button
    openBtn.addEventListener('click', function() {
        // Animate cover exit
        coverSection.style.transition = 'all 1s ease';
        coverSection.style.opacity = '0';
        coverSection.style.transform = 'translateY(-100%)';
        
        // Show main content after delay
        setTimeout(() => {
            coverSection.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Animate main content entrance
            mainContent.style.opacity = '0';
            mainContent.style.transition = 'opacity 1s ease';
            
            setTimeout(() => {
                mainContent.style.opacity = '1';
                
                // Initialize animations for timeline items
                initScrollAnimations();
            }, 100);
        }, 1000);
    });
    
    // Music toggle
    musicToggle.addEventListener('click', function() {
        if (isMusicPlaying) {
            weddingMusic.pause();
            musicIcon.className = 'fas fa-play';
            musicText.textContent = 'Putar Musik';
        } else {
            weddingMusic.play().catch(e => {
                console.log("Autoplay prevented: ", e);
                // If autoplay is prevented, update UI anyway
                musicIcon.className = 'fas fa-pause';
                musicText.textContent = 'Jeda Musik';
            });
            musicIcon.className = 'fas fa-pause';
            musicText.textContent = 'Jeda Musik';
        }
        isMusicPlaying = !isMusicPlaying;
    });
    
    // RSVP Form submission
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const attendance = document.getElementById('attendance').value;
        const guestCount = parseInt(document.getElementById('guestCount').value);
        
        // Update counters
        if (attendance === 'yes') {
            confirmedCount += guestCount;
            confirmedGuests.textContent = confirmedCount;
            
            // Show success message
            showNotification('Terima kasih ' + name + '! Konfirmasi kehadiran berhasil dikirim.', 'success');
        } else {
            showNotification('Terima kasih ' + name + '! Kami menghargai konfirmasi Anda.', 'info');
        }
        
        totalCount += guestCount;
        totalGuests.textContent = totalCount;
        
        // Reset form
        rsvpForm.reset();
        
        // Animate counter update
        animateCounterUpdate();
    });
    
    // Countdown timer
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;
        
        if (timeLeft < 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        daysEl.textContent = days < 10 ? '0' + days : days;
        hoursEl.textContent = hours < 10 ? '0' + hours : hours;
        minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }
    
    // Initialize countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Scroll animations for timeline
    function initScrollAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        // Function to check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
            );
        }
        
        // Function to handle scroll
        function handleScroll() {
            timelineItems.forEach(item => {
                if (isInViewport(item)) {
                    item.classList.add('visible');
                }
            });
        }
        
        // Initial check
        handleScroll();
        
        // Listen for scroll
        window.addEventListener('scroll', handleScroll);
    }
    
    // Show notification
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <p>${message}</p>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Animate counter update
    function animateCounterUpdate() {
        const counters = document.querySelectorAll('.counter-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const increment = target / 20;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 50);
        });
    }
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 30px;
            right: 30px;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            max-width: 400px;
            transform: translateX(150%);
            transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            z-index: 10000;
            border-left: 5px solid #2ecc71;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left-color: #2ecc71;
        }
        
        .notification-info {
            border-left-color: #3498db;
        }
        
        .notification p {
            margin: 0;
            flex-grow: 1;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            margin-left: 15px;
        }
        
        @media (max-width: 768px) {
            .notification {
                min-width: 250px;
                right: 15px;
                left: 15px;
                max-width: calc(100% - 30px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize some particles animation
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        // Randomize animation duration
        const duration = 15 + Math.random() * 10;
        particle.style.animationDuration = `${duration}s`;
    });
    
    // Add hover effect to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.gallery-overlay');
            overlay.style.transition = 'opacity 0.5s ease';
        });
    });
    
    // Simulate loading of main content
    setTimeout(() => {
        // Pre-load any heavy resources
        console.log("Website undangan siap!");
    }, 1000);
});