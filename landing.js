// ===== PARTICLES BACKGROUND =====
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 100 };
        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        const count = Math.min(80, Math.floor((this.canvas.width * this.canvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.4 + 0.1,
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(102, 126, 234, ${p.opacity})`;
            this.ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(102, 126, 234, ${0.06 * (1 - dist / 120)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ===== NAVBAR SCROLL =====
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        menu.classList.toggle('active');
        const icon = btn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            const icon = btn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
        });
    });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                animateNumber(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateNumber(el, target) {
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(eased * target);
        el.textContent = formatNumber(current) + '+';

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

// ===== FAQ ACCORDION =====
function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        const btn = item.querySelector('.faq-question');
        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            items.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const elements = document.querySelectorAll('.feature-card, .pricing-card, .stat-card, .faq-item, .claim-card, .cta-card');
    elements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

// ===== CLAIM INPUT =====
function initClaim() {
    const input = document.getElementById('claimInput');
    const btn = document.getElementById('claimBtn');
    const status = document.getElementById('claimStatus');
    if (!input || !btn || !status) return;

    btn.addEventListener('click', () => {
        const username = input.value.trim();
        if (!username) {
            status.innerHTML = '<span style="color: #f5576c;">Please enter a username</span>';
            return;
        }
        if (username.length < 3) {
            status.innerHTML = '<span style="color: #f5576c;">Username must be at least 3 characters</span>';
            return;
        }
        status.innerHTML = '<span style="color: #43e97b;">✓ Username available! Redirecting...</span>';
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') btn.click();
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles-canvas');
    if (canvas) new ParticleSystem(canvas);

    initNavbar();
    initMobileMenu();
    animateCounters();
    initFAQ();
    initScrollAnimations();
    initClaim();
    initSmoothScroll();
});
