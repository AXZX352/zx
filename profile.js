// ===== CUSTOM CURSOR =====
function initCursor() {
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');
    if (!cursor || !trail) return;

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateTrail() {
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Hover effect
    const hoverElements = document.querySelectorAll('a, button, .social-link, .quick-icon, .player-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// ===== SNOW / PARTICLE EFFECT =====
class SnowEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.min(100, Math.floor((this.canvas.width * this.canvas.height) / 12000));
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 0.5,
            speedY: Math.random() * 0.5 + 0.2,
            speedX: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.5 + 0.1,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.02 + 0.01,
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            p.y += p.speedY;
            p.wobble += p.wobbleSpeed;
            p.x += Math.sin(p.wobble) * 0.3 + p.speedX;

            if (p.y > this.canvas.height + 10) {
                p.y = -10;
                p.x = Math.random() * this.canvas.width;
            }
            if (p.x < -10) p.x = this.canvas.width + 10;
            if (p.x > this.canvas.width + 10) p.x = -10;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ===== TYPEWRITER EFFECT =====
function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const text = el.textContent;
    el.textContent = '';

    let i = 0;
    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, 120 + Math.random() * 80);
        }
    }

    setTimeout(type, 500);
}

// ===== MUSIC PLAYER =====
function initMusicPlayer() {
    const player = document.getElementById('musicPlayer');
    const playBtn = document.getElementById('playBtn');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');

    if (!player || !playBtn) return;

    let isPlaying = false;
    let progress = 0;
    let intervalId = null;
    const totalDuration = 200; // seconds (3:20)

    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        player.classList.toggle('playing', isPlaying);
        const icon = playBtn.querySelector('i');
        icon.classList.toggle('fa-play', !isPlaying);
        icon.classList.toggle('fa-pause', isPlaying);

        if (isPlaying) {
            intervalId = setInterval(() => {
                progress += 0.5;
                if (progress >= totalDuration) {
                    progress = 0;
                }
                const percent = (progress / totalDuration) * 100;
                progressFill.style.width = percent + '%';

                const mins = Math.floor(progress / 60);
                const secs = Math.floor(progress % 60);
                currentTimeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            }, 500);
        } else {
            clearInterval(intervalId);
        }
    });

    // Progress bar click
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percent = clickX / rect.width;
            progress = percent * totalDuration;
            progressFill.style.width = (percent * 100) + '%';

            const mins = Math.floor(progress / 60);
            const secs = Math.floor(progress % 60);
            currentTimeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        });
    }
}

// ===== SOCIAL LINK CLICK RIPPLE =====
function initRippleEffect() {
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                transform: translate(-50%, -50%);
                animation: rippleAnim 0.6s ease-out forwards;
                pointer-events: none;
                left: ${e.clientX - this.getBoundingClientRect().left}px;
                top: ${e.clientY - this.getBoundingClientRect().top}px;
            `;
            this.appendChild(ripple);

            // Add ripple keyframes if not exists
            if (!document.getElementById('ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = `
                    @keyframes rippleAnim {
                        to {
                            width: 300px;
                            height: 300px;
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ===== VIEW COUNTER ANIMATION =====
function initViewCounter() {
    const viewCount = document.getElementById('viewCount');
    if (!viewCount) return;

    const target = parseInt(viewCount.textContent.replace(/,/g, ''));
    let current = 0;
    const duration = 1500;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.floor(eased * target);
        viewCount.textContent = new Intl.NumberFormat('en-US').format(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    setTimeout(() => requestAnimationFrame(update), 600);
}

// ===== TILT EFFECT ON LINKS =====
function initTiltEffect() {
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -2;
            const rotateY = (x - centerX) / centerX * 2;
            link.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(4px)`;
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = 'perspective(500px) rotateX(0) rotateY(0) translateX(0)';
        });
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initCursor();

    const snowCanvas = document.getElementById('snow-canvas');
    if (snowCanvas) new SnowEffect(snowCanvas);

    initTypewriter();
    initMusicPlayer();
    initRippleEffect();
    initViewCounter();
    initTiltEffect();
});
