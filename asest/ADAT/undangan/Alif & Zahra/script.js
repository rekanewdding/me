// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.querySelector('.main-content');
    const openInvitationBtn = document.getElementById('open-invitation-btn');
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    const rsvpForm = document.getElementById('rsvp-form');
    
    // Countdown elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // Wedding date: February 15, 2026
    const weddingDate = new Date('February 15, 2026 08:00:00').getTime();
    
    // Loading screen timeout
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Initialize animations and effects
            initAnimations();
            initParticles();
            initScrollAnimations();
            startCountdown();
            
            // Auto-play background music with user interaction
            document.addEventListener('click', function initMusic() {
                if (bgMusic.paused) {
                    bgMusic.volume = 0.5;
                    bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
                }
                document.removeEventListener('click', initMusic);
            }, { once: true });
        }, 800);
    }, 1500);
    
    // Open invitation button
    openInvitationBtn.addEventListener('click', function() {
        // Add ripple effect
        createRippleEffect(this);
        
        // Scroll to next section
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
            this.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            bgMusic.play().catch(e => console.log("Play failed:", e));
            this.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        isMusicPlaying = !isMusicPlaying;
        
        // Button animation
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
    
    // RSVP form submission
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const attendance = document.getElementById('attendance').value;
        const message = document.getElementById('message').value;
        
        // Show success message
        alert(`Terima kasih ${name} atas konfirmasi kehadiran Anda!`);
        
        // Reset form
        rsvpForm.reset();
        
        // Create floating success indicator
        createFloatingHeart();
    });
    
    // Initialize animations
    function initAnimations() {
        // Add ripple effect to all buttons
        const buttons = document.querySelectorAll('.btn-elegant, .btn-elegant-outline');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                createRippleEffect(this, e);
            });
        });
        
        // Add hover effect to gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // Create random sparkles
        createSparkles();
    }
    
    // Create ripple effect
    function createRippleEffect(element, event = null) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        
        let x, y;
        if (event) {
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        } else {
            x = rect.width / 2;
            y = rect.height / 2;
        }
        
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Initialize particles
    function initParticles() {
        const container = document.getElementById('particles-container');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            createParticle(container);
        }
    }
    
    // Create a single particle
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random position
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        
        // Random color (gold or rose)
        const colors = ['#d4af37', '#e8c96a', '#b76e79'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        
        // Add floating animation
        particle.style.animation = `float ${Math.random() * 10 + 10}s infinite ease-in-out`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(particle);
    }
    
    // Initialize scroll animations
    function initScrollAnimations() {
        const revealElements = document.querySelectorAll('.reveal-text');
        
        const revealOnScroll = () => {
            revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('active');
                }
            });
        };
        
        // Initial check
        revealOnScroll();
        
        // Check on scroll
        window.addEventListener('scroll', revealOnScroll);
        
        // Parallax effect
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax-section');
            
            parallaxElements.forEach(element => {
                const rate = scrolled * 0.5;
                element.style.backgroundPosition = `center ${rate}px`;
            });
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
            element.style.color = '#e8c96a';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.color = '#d4af37';
            }, 300);
        }
    }
    
    // Create sparkle effects
    function createSparkles() {
        const sparkleContainer = document.getElementById('particles-container');
        const sparkleCount = 15;
        
        for (let i = 0; i < sparkleCount; i++) {
            setTimeout(() => {
                createSparkle(sparkleContainer);
            }, i * 500);
        }
        
        // Keep creating sparkles periodically
        setInterval(() => {
            createSparkle(sparkleContainer);
        }, 2000);
    }
    
    // Create a single sparkle
    function createSparkle(container) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Random position
        sparkle.style.left = Math.random() * 100 + 'vw';
        sparkle.style.top = Math.random() * 100 + 'vh';
        
        // Random animation delay
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(sparkle);
        
        // Remove after animation
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }
    
    // Create floating heart for RSVP success
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        heart.style.position = 'fixed';
        heart.style.bottom = '20px';
        heart.style.right = '20px';
        heart.style.color = '#b76e79';
        heart.style.fontSize = '2rem';
        heart.style.zIndex = '100';
        heart.style.opacity = '0';
        heart.style.transform = 'translateY(0)';
        heart.style.transition = 'all 1s ease';
        
        document.body.appendChild(heart);
        
        // Animate in
        setTimeout(() => {
            heart.style.opacity = '1';
            heart.style.transform = 'translateY(-20px)';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            heart.style.opacity = '0';
            heart.style.transform = 'translateY(-50px)';
            
            setTimeout(() => {
                heart.remove();
            }, 1000);
        }, 3000);
    }
    
    // Add smooth zoom effect to cover background
    function initCoverZoom() {
        const coverSection = document.getElementById('cover');
        let scale = 1;
        
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            
            if (scrolled < window.innerHeight) {
                scale = 1 + (scrolled * 0.0005);
                coverSection.style.transform = `scale(${scale})`;
            }
        });
    }
    
    // Initialize cover zoom
    initCoverZoom();
    
    // Add touch support for mobile
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Prevent context menu on long press
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
});