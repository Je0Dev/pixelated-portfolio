// Pixelated Portfolio JavaScript
// Main functionality for interactive features and animations

class PixelPortfolio {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.typewriterInstances = [];
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupTypewriters();
        this.setupScrollAnimations();
        this.startParticleAnimation();
    }

    setupCanvas() {
        // Create canvas for particle system
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.canvas.style.opacity = '0.6';
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        // Mouse movement tracking
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Add particles on mouse movement
            if (Math.random() < 0.1) {
                this.addParticle(this.mouse.x, this.mouse.y);
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });

        // Click events for interactive elements
        document.addEventListener('click', (e) => {
            if (e.target.matches('.pixel-button, .project-card, .skill-item')) {
                this.createClickParticles(e.clientX, e.clientY);
            }
        });

        // Navigation hover effects
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                this.animateNavHover(e.target);
            });
        });
    }

    addParticle(x, y, color = null) {
        const colors = ['#00d4ff', '#ff006e', '#39ff14', '#ffdd00', '#ff00ff'];
        
        this.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            color: color || colors[Math.floor(Math.random() * colors.length)],
            life: 1.0,
            decay: Math.random() * 0.02 + 0.005
        });
    }

    createClickParticles(x, y) {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.addParticle(x, y);
            }, i * 50);
        }
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            return particle.life > 0;
        });
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections between nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life;
            
            // Draw pixel-perfect square particles
            this.ctx.fillRect(
                Math.floor(particle.x),
                Math.floor(particle.y),
                Math.floor(particle.size),
                Math.floor(particle.size)
            );
        });
        
        this.ctx.globalAlpha = 1;
    }

    startParticleAnimation() {
        const animate = () => {
            this.updateParticles();
            this.drawParticles();
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    initializeAnimations() {
        // Initialize Anime.js animations
        if (typeof anime !== 'undefined') {
            // Page load animation
            anime({
                targets: '.fade-in',
                opacity: [0, 1],
                translateY: [50, 0],
                duration: 1000,
                delay: anime.stagger(100),
                easing: 'easeOutExpo'
            });

            // Neon glow animation for headings
            anime({
                targets: '.neon-text',
                textShadow: [
                    '0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 15px #00d4ff',
                    '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff',
                    '0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 15px #00d4ff'
                ],
                duration: 2000,
                loop: true,
                direction: 'alternate',
                easing: 'easeInOutSine'
            });
        }
    }

    setupTypewriters() {
        // Initialize Typed.js for typewriter effects
        if (typeof Typed !== 'undefined') {
            const typewriterElements = document.querySelectorAll('.typewriter');
            
            typewriterElements.forEach((element, index) => {
                const text = element.textContent;
                element.textContent = '';
                
                const typed = new Typed(element, {
                    strings: [text],
                    typeSpeed: 50,
                    startDelay: index * 500,
                    showCursor: true,
                    cursorChar: '_',
                    onComplete: () => {
                        setTimeout(() => {
                            typed.cursor.remove();
                        }, 2000);
                    }
                });
                
                this.typewriterInstances.push(typed);
            });
        }
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger specific animations based on element type
                    if (entry.target.matches('.skill-bar')) {
                        this.animateSkillBar(entry.target);
                    } else if (entry.target.matches('.project-card')) {
                        this.animateProjectCard(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    animateSkillBar(element) {
        const progress = element.dataset.progress || 0;
        
        if (typeof anime !== 'undefined') {
            anime({
                targets: element.querySelector('.skill-progress'),
                width: progress + '%',
                duration: 1500,
                easing: 'easeOutExpo'
            });
        }
    }

    animateProjectCard(element) {
        if (typeof anime !== 'undefined') {
            anime({
                targets: element,
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutBack'
            });
        }
    }

    animateNavHover(element) {
        // Create pixel trail effect
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.addParticle(centerX, centerY, '#00d4ff');
            }, i * 100);
        }
    }

    // Form validation for contact form
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
                this.showFieldError(input, 'Please enter a valid email address');
                isValid = false;
            } else {
                this.showFieldSuccess(input);
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    showFieldSuccess(field) {
        field.classList.add('success');
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Project filter functionality
    filterProjects(category) {
        const projects = document.querySelectorAll('.project-item');
        const buttons = document.querySelectorAll('.filter-btn');

        // Update active button
        buttons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${category}"]`).classList.add('active');

        // Filter projects
        projects.forEach(project => {
            const projectCategory = project.dataset.category;
            const shouldShow = category === 'all' || projectCategory === category;

            if (shouldShow) {
                project.style.display = 'block';
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: project,
                        opacity: [0, 1],
                        scale: [0.8, 1],
                        duration: 500,
                        easing: 'easeOutBack'
                    });
                }
            } else {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: project,
                        opacity: [1, 0],
                        scale: [1, 0.8],
                        duration: 300,
                        easing: 'easeInBack',
                        complete: () => {
                            project.style.display = 'none';
                        }
                    });
                } else {
                    project.style.display = 'none';
                }
            }
        });
    }

    // Cleanup function
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.typewriterInstances.forEach(typed => {
            typed.destroy();
        });
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pixelPortfolio = new PixelPortfolio();
});

// Utility functions for specific interactions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success message
        const message = document.createElement('div');
        message.textContent = 'Copied to clipboard!';
        message.className = 'copy-success';
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    });
}

function showComingSoon() {
    const modal = document.createElement('div');
    modal.className = 'coming-soon-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Coming Soon!</h3>
            <p>This feature is currently under development.</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 3000);
}