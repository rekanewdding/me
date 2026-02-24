// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.querySelector('.main-content');
    const openInvitationBtn = document.getElementById('open-invitation');
    const musicToggle = document.getElementById('music-toggle');
    const themeSwitch = document.getElementById('theme-switch');
    const bgMusic = document.getElementById('bg-music');
    const rsvpForm = document.getElementById('rsvp-form');
    
    // Countdown elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // Wedding date: February 15, 2026
    const weddingDate = new Date('February 15, 2026 08:00:00').getTime();
    
    // Loading screen with progress
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Initialize animations and effects
            initAnimations();
            initScrollAnimations();
            startCountdown();
            createFloatingSparkles();
            
            // Auto-play background music with user interaction
            document.addEventListener('click', function initMusic() {
                if (bgMusic.paused) {
                    bgMusic.volume = 0.3;
                    bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
                }
                document.removeEventListener('click', initMusic);
            }, { once: true });
        }, 800);
    }, 2000);
    
    // Open invitation button with ripple effect
    openInvitationBtn.addEventListener('click', function(e) {
        createRipple(e);
        
        // Scroll to opening section
        document.getElementById('opening').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Button animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
    
    // Music toggle
    let isMusicPlaying = false;
    musicToggle.addEventListener('click', function() {
        if (isMusicPlaying) {
            bgMusic.pause();
            this.innerHTML = '<i class="fas fa-volume-mute"></i><span class="music-label">Sound Off</span>';
        } else {
            bgMusic.play().catch(e => console.log("Play failed:", e));
            this.innerHTML = '<i class="fas fa-volume-up"></i><span class="music-label">Sound On</span>';
        }
        isMusicPlaying = !isMusicPlaying;
        
        // Button animation
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
    
    // Dark mode toggle
    let isDarkMode = false;
    themeSwitch.addEventListener('click', function() {
        isDarkMode = !isDarkMode;
        
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            this.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            this.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        // Button animation
        this.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(0)';
        }, 300);
    });
    
    // RSVP form submission
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const guest = document.getElementById('guest').value;
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const message = document.getElementById('message').value;
        
        // Show success message
        showNotification(`Thanks ${name}! We've saved your RSVP. Can't wait to see you! 🎉`);
        
        // Reset form
        rsvpForm.reset();
        
        // Create floating confetti
        createConfetti();
    });
    
    // Initialize animations
    function initAnimations() {
        // Add ripple effect to all buttons
        const buttons = document.querySelectorAll('.genz-btn, .event-btn, .submit-btn, .location-btn');
        buttons.forEach(button => {
            button.addEventListener('click', createRipple);
        });
        
        // Add hover effect to cards
        const cards = document.querySelectorAll('.couple-card, .event-card, .glass-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
        
        // Add hover effect to gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.05)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1)';
            });
        });
        
        // Add click effect to social icons
        const socialIcons = document.querySelectorAll('.social-icon, .social-link');
        socialIcons.forEach(icon => {
            icon.addEventListener('click', function(e) {
                e.preventDefault();
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });
    }
    
    // Create ripple effect
    function createRipple(e) {
        const btn = e.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(btn.clientWidth, btn.clientHeight);
        const radius = diameter / 2;
        
        const rect = btn.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('ripple-effect');
        
        // Remove existing ripples
        const ripple = btn.getElementsByClassName('ripple-effect')[0];
        if (ripple) ripple.remove();
        
        btn.appendChild(circle);
        
        // Remove after animation
        setTimeout(() => {
            circle.remove();
        }, 600);
    }
    
    // Initialize scroll animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            observer.observe(section);
        });
        
        // Add parallax effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroSection = document.getElementById('hero');
            
            if (heroSection) {
                const rate = scrolled * 0.5;
                heroSection.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Start countdown
    function startCountdown() {
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
            
            // Calculate days, hours, minutes, seconds
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            // Update display
            daysEl.textContent = days.toString().padStart(2, '0');
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
            
            // Add animation to changing numbers
            animateCountdownNumber(daysEl, days);
            animateCountdownNumber(hoursEl, hours);
            animateCountdownNumber(minutesEl, minutes);
            animateCountdownNumber(secondsEl, seconds);
        }
        
        // Initial update
        updateCountdown();
        
        // Update every second
        setInterval(updateCountdown, 1000);
    }
    
    // Animate countdown number change
    function animateCountdownNumber(element, newValue) {
        const oldValue = parseInt(element.textContent);
        
        if (oldValue !== newValue) {
            element.style.transform = 'scale(1.2)';
            element.style.color = '#ffffff';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.color = '#ffffff';
            }, 300);
        }
    }
    
    // Create floating sparkles
    function createFloatingSparkles() {
        const container = document.getElementById('floating-elements');
        
        setInterval(() => {
            createSparkle(container);
        }, 1000);
    }
    
    // Create a single sparkle
    function createSparkle(container) {
        const sparkle = document.createElement('div');
        sparkle.className = 'floating-sparkle';
        
        // Random position
        sparkle.style.left = Math.random() * 100 + 'vw';
        
        // Random size
        const size = Math.random() * 10 + 5;
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';
        
        // Random color
        const colors = ['#4a6cf7', '#6d8cff', '#4cd964', '#7de893', '#ff9a9e'];
        sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random opacity
        sparkle.style.opacity = Math.random() * 0.5 + 0.3;
        
        container.appendChild(sparkle);
        
        // Animate
        const animation = sparkle.animate([
            { 
                transform: 'translateY(100vh) rotate(0deg)',
                opacity: 0 
            },
            { 
                transform: 'translateY(-100px) rotate(180deg)',
                opacity: sparkle.style.opacity 
            }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        // Remove after animation
        animation.onfinish = () => {
            sparkle.remove();
        };
    }
    
    // Create confetti effect
    function createConfetti() {
        const confettiCount = 50;
        const colors = ['#4a6cf7', '#6d8cff', '#4cd964', '#7de893', '#ff6b6b', '#ff9a9e'];
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                createConfettiPiece(colors);
            }, i * 20);
        }
    }
    
    // Create a single confetti piece
    function createConfettiPiece(colors) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        // Random position
        confetti.style.left = Math.random() * 100 + 'vw';
        
        // Random size
        const size = Math.random() * 10 + 5;
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        
        // Random color
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random shape
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        document.body.appendChild(confetti);
        
        // Animate
        const animation = confetti.animate([
            { 
                transform: 'translateY(-100px) rotate(0deg)',
                opacity: 1 
            },
            { 
                transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`,
                opacity: 0 
            }
        ], {
            duration: Math.random() * 1000 + 1000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        // Remove after animation
        animation.onfinish = () => {
            confetti.remove();
        };
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide and remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.7);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .floating-sparkle {
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
        }
        
        .confetti-piece {
            position: fixed;
            top: 0;
            pointer-events: none;
            z-index: 9999;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4a6cf7, #4cd964);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            transform: translateX(150%);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            z-index: 1000;
            max-width: 300px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        .animate-in {
            animation: fadeInUp 0.8s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add touch support for mobile
    document.addEventListener('touchstart', function() {}, {passive: true});
});