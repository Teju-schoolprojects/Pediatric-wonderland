/* -------------------------------------------------------------
   Pediatric Wonderland - Interactive Application Engine (app.js)
------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize functions
    initScrollAnimations();
    initVideoPlayback();
    initStorybookTracker();
    initMobileMenu();
    initBookingPortal();
    initFaqAccordion();
    initSparkleCursor();
});

/* -------------------------------------------------------------
   1. Scroll Animations (Intersection Observer)
------------------------------------------------------------- */
function initScrollAnimations() {
    const animElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once visible, we can unobserve if we only want it to animate once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animElements.forEach(el => animationObserver.observe(el));
}

/* -------------------------------------------------------------
   2. Video Playback Optimization
   Plays videos in viewport, pauses them when offscreen
------------------------------------------------------------- */
function initVideoPlayback() {
    const videos = document.querySelectorAll('.chapter-video');
    
    const videoObserverOptions = {
        root: null,
        rootMargin: '100px', // Start loading/playing slightly before entering
        threshold: 0.25
    };
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            
            if (entry.isIntersecting) {
                // Play video if it's not already playing
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // Autoplay was prevented by browser security rules
                        console.log('Video autoplay prevented: ', error);
                    });
                }
            } else {
                // Pause video to conserve CPU/GPU resources
                video.pause();
            }
        });
    }, videoObserverOptions);
    
    videos.forEach(vid => {
        videoObserver.observe(vid);
        
        // Ensure loops are handled correctly
        vid.loop = true;
        
        // Inline setup to ensure autoplay functions properly
        vid.setAttribute('muted', '');
        vid.setAttribute('playsinline', '');
    });
}

/* -------------------------------------------------------------
   3. Storybook Floating Tracker
   Updates side progress bar and handles clicks
------------------------------------------------------------- */
function initStorybookTracker() {
    const chapters = document.querySelectorAll('.story-chapter');
    const trackerNodes = document.querySelectorAll('.tracker-node');
    const progressBar = document.querySelector('.tracker-progress');
    const header = document.querySelector('.main-header');
    
    // Header shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const trackerObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px', // Focus window in the upper-middle of viewport
        threshold: 0
    };

    const trackerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chapterId = entry.target.getAttribute('id');
                const activeNode = document.querySelector(`.tracker-node[href="#${chapterId}"]`);
                
                if (activeNode) {
                    // Remove active from all nodes
                    trackerNodes.forEach(node => node.classList.remove('active'));
                    // Add active to current
                    activeNode.classList.add('active');
                    
                    // Also update regular header links
                    const headerLinks = document.querySelectorAll('.nav-link');
                    headerLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${chapterId}`) {
                            link.classList.add('active');
                        }
                    });

                    // Update vertical progress bar percentage
                    const nodeIndex = parseInt(activeNode.getAttribute('data-chapter'), 10) - 1;
                    const percent = (nodeIndex / (trackerNodes.length - 1)) * 100;
                    if (progressBar) {
                        progressBar.style.height = `${percent}%`;
                    }
                }
            }
        });
    }, trackerObserverOptions);

    chapters.forEach(chapter => trackerObserver.observe(chapter));
}

/* -------------------------------------------------------------
   4. Mobile Menu Navigation
------------------------------------------------------------- */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            menuToggle.classList.toggle('open-active');
            
            // Animate mobile bars
            const bars = menuToggle.querySelectorAll('.bar');
            if (menuToggle.classList.contains('open-active')) {
                bars[0].style.transform = 'translateY(7px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu on click of nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                menuToggle.classList.remove('open-active');
                const bars = menuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }
}

/* -------------------------------------------------------------
   5. Magical Booking Portal & Magic Ticket System
------------------------------------------------------------- */
function initBookingPortal() {
    const bookingForm = document.getElementById('magical-booking-form');
    const ticketDisplay = document.getElementById('magic-ticket-display');
    const printBtn = document.getElementById('print-ticket-btn');
    const resetBtn = document.getElementById('reset-ticket-btn');
    
    if (bookingForm && ticketDisplay) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values
            const name = document.getElementById('child-name').value;
            const age = document.getElementById('child-age').value;
            const theme = document.getElementById('adventure-theme').value;
            const flavor = document.getElementById('paste-flavor').value;
            const comfort = document.getElementById('comfort-buddy').value;
            
            // Set ticket values
            document.getElementById('ticket-child-name').textContent = `${name} (Age ${age})`;
            document.getElementById('ticket-theme').textContent = theme;
            document.getElementById('ticket-flavor').textContent = flavor;
            document.getElementById('ticket-comfort').textContent = comfort;
            
            // Toggle form & ticket display
            bookingForm.classList.add('hidden');
            ticketDisplay.classList.remove('hidden');

            // Trigger sparkle blast celebration
            triggerSparkleBlast();
        });
        
        // Print ticket action
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
        
        // Reset/Customize again action
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                bookingForm.reset();
                ticketDisplay.classList.add('hidden');
                bookingForm.classList.remove('hidden');
            });
        }
    }
}

/* -------------------------------------------------------------
   6. FAQ Accordion Animation
------------------------------------------------------------- */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        
        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-content').style.maxHeight = '0px';
                    }
                });
                
                // Toggle current FAQ
                if (isActive) {
                    item.classList.remove('active');
                    content.style.maxHeight = '0px';
                } else {
                    item.classList.add('active');
                    // Compute full height of content
                    content.style.maxHeight = `${content.scrollHeight}px`;
                }
            });
        }
    });
}

/* -------------------------------------------------------------
   7. Canvas-Based Magical Sparkle Cursor Trail
------------------------------------------------------------- */
let sparkleParticles = [];
const colorPalette = ['#9d8df2', '#ffb7c5', '#a2e8dd', '#ffe596', '#a3daff'];

function initSparkleCursor() {
    const canvas = document.getElementById('sparkle-canvas');
    if (!canvas) return;
    
    // Disable trail on touch devices to prevent lag and clean up mobile experience
    if (window.matchMedia('(pointer: coarse)').matches) {
        canvas.style.display = 'none';
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Resize canvas to full viewport
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse movement tracker
    let lastMousePos = { x: 0, y: 0 };
    let mouseMoved = false;
    
    window.addEventListener('mousemove', (e) => {
        lastMousePos.x = e.clientX;
        lastMousePos.y = e.clientY;
        mouseMoved = true;
        
        // Spawn small trail particles
        if (Math.random() < 0.45) {
            spawnParticle(e.clientX, e.clientY);
        }
    });
    
    // Particle Class
    class Particle {
        constructor(x, y, isBlast = false) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 2;
            this.color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            
            // Speeds
            if (isBlast) {
                // High speeds outwards in 360 degrees
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 3;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.size = Math.random() * 6 + 3;
            } else {
                // Gentle floating speeds
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5 - 0.4; // float upward slightly
            }
            
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.015;
            this.gravity = isBlast ? 0.15 : 0; // fall down slightly if blast
        }
        
        update() {
            this.x += this.vx;
            this.vy += this.gravity;
            this.y += this.vy;
            this.alpha -= this.decay;
            if (this.size > 0.1) this.size -= 0.05;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            
            // Draw star/sparkle shapes
            if (Math.random() < 0.2) {
                // Draw cross/star
                ctx.moveTo(this.x, this.y - this.size * 1.5);
                ctx.lineTo(this.x + this.size * 0.5, this.y - this.size * 0.5);
                ctx.lineTo(this.x + this.size * 1.5, this.y);
                ctx.lineTo(this.x + this.size * 0.5, this.y + this.size * 0.5);
                ctx.lineTo(this.x, this.y + this.size * 1.5);
                ctx.lineTo(this.x - this.size * 0.5, this.y + this.size * 0.5);
                ctx.lineTo(this.x - this.size * 1.5, this.y);
                ctx.lineTo(this.x - this.size * 0.5, this.y - this.size * 0.5);
            } else {
                // Regular soft circle
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            }
            
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }
    
    function spawnParticle(x, y) {
        sparkleParticles.push(new Particle(x, y));
    }
    
    // Expose celebration blast globally
    window.triggerSparkleBlast = function() {
        const rect = document.getElementById('booking-portal').getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 60; i++) {
            sparkleParticles.push(new Particle(centerX, centerY, true));
        }
    };
    
    // Main animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = sparkleParticles.length - 1; i >= 0; i--) {
            const p = sparkleParticles[i];
            p.update();
            p.draw();
            
            // Remove dead particles
            if (p.alpha <= 0 || p.size <= 0) {
                sparkleParticles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    animate();
}

/* -------------------------------------------------------------
   Safeguard: Automatically Strip any Injected 'CLOSED NOW' Text/Badges
------------------------------------------------------------- */
function removeClosedNowBadges() {
    try {
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            if (el.children.length === 0 && el.textContent && el.textContent.toUpperCase().includes('CLOSED NOW')) {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                if (el.parentElement && el.parentElement.children.length === 1) {
                    el.parentElement.style.display = 'none';
                }
            }
        });
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', removeClosedNowBadges);
window.addEventListener('load', removeClosedNowBadges);
setInterval(removeClosedNowBadges, 800);
