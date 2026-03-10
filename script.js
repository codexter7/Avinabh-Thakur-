// --- Particle Background Animation ---
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
let shootingStars = [];

// Mouse interaction tracking
let mouse = {
    x: null,
    y: null,
    radius: 120 // Radius of repulsion
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
});

class Particle {
    constructor(x, y, dx, dy, size) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.baseX = x;
        this.baseY = y;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
    }

    update() {
        // Starfield drift
        this.x += this.dx;
        this.y += this.dy;

        // Wrap around screen
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;

        // Mouse interaction (repulsion)
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;

                // Move particle away from mouse
                this.x -= forceDirectionX * force * 5;
                this.y -= forceDirectionY * force * 5;
            }
        }

        this.draw();
    }
}

class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        // Spawn mostly from the top or right
        if (Math.random() < 0.5) {
            this.x = Math.random() * width;
            this.y = 0;
        } else {
            this.x = width;
            this.y = Math.random() * height;
        }

        this.length = (Math.random() * 150) + 50; // Longer tails
        this.speed = (Math.random() * 15) + 10; // Faster
        this.size = (Math.random() * 2) + 1; // Thicker
        this.opacity = Math.random() * 0.5 + 0.5; // Brighter
        this.active = false;

        // Random angle for shooting star (diagonally down and left)
        const angle = (Math.random() * Math.PI / 6) + (3 * Math.PI / 4); // Between 135 and 165 degrees
        this.dx = Math.cos(angle) * this.speed;
        this.dy = Math.sin(angle) * this.speed;
    }

    spawn() {
        this.active = true;
        this.reset();
    }

    draw() {
        if (!this.active) return;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.dx * this.length, this.y - this.dy * this.length);

        // Create gradient for the tail
        let gradient = ctx.createLinearGradient(this.x, this.y, this.x - this.dx * this.length, this.y - this.dy * this.length);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.size;
        ctx.stroke();
    }

    update() {
        if (!this.active) return;

        this.x += this.dx;
        this.y += this.dy;

        // Deactivate when off screen
        if (this.x > width + this.length || this.x < -this.length || this.y > height + this.length) {
            this.active = false;
        }

        this.draw();
    }
}

function initParticles() {
    particles = [];
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    // Number of particles relative to screen size for galaxy feel (reduced density)
    let numberOfParticles = Math.floor((width * height) / 4000);

    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 1.5 + 0.5; // Small white dots
        let x = Math.random() * width;
        let y = Math.random() * height;
        // Very slow drifting speed
        let dx = (Math.random() - 0.5) * 0.15;
        let dy = (Math.random() - 0.5) * 0.15;
        particles.push(new Particle(x, y, dx, dy, size));
    }

    // Initialize pool of shooting stars
    shootingStars = [];
    for (let i = 0; i < 30; i++) { // Increased pool size
        shootingStars.push(new ShootingStar());
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    // Slight trail effect by not clearing completely
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Fades out previous frames
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }

    // Randomly spawn shooting stars more frequently
    if (Math.random() < 0.15) { // Increased spawn chance to 15% per frame
        let inactiveStar = shootingStars.find(star => !star.active);
        if (inactiveStar) {
            inactiveStar.spawn();
        }
    }

    // Update active shooting stars
    for (let i = 0; i < shootingStars.length; i++) {
        shootingStars[i].update();
    }
}

// Initialize canvas
initParticles();
animateParticles();


// --- Smooth scroll revelation (reveal on scroll) ---
document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll(".reveal");

    const revealOnScroll = () => {
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 50;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    };

    // Run once on load
    setTimeout(revealOnScroll, 100);

    // Run on scroll
    window.addEventListener("scroll", revealOnScroll);

    // --- Form Handling for Direct Messaging Box ---
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            // Simulate sending
            btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Sending...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            // Simulate network request
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;

                contactForm.reset();

                formMessage.textContent = "Message sent successfully! I'll get back to you soon.";
                formMessage.classList.add('success');

                setTimeout(() => {
                    formMessage.classList.remove('success');
                }, 5000);
            }, 1500);
        });
    }

    // --- Typewriter Effect for Hero Subtitle (ChatGPT Style) ---
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const textToType = "Electronics Engineer & AI Developer. Exploring the intersection of hardware, VLSI, and embodied AI to build autonomous, intelligent systems.";
        let currentIndex = 0;

        // Dynamic speed mapping similar to LLM token streaming
        function typeNextChar() {
            if (currentIndex < textToType.length) {
                // Determine speed (faster for letters, slower for punctuation)
                const char = textToType.charAt(currentIndex);
                let typingSpeed = Math.random() * 30 + 20; // Base speed 20-50ms

                if (char === '.' || char === ',') {
                    typingSpeed += 300; // Pause at punctuation
                }

                typingTextElement.textContent += char;
                currentIndex++;
                setTimeout(typeNextChar, typingSpeed);
            }
        }

        // Start typing after a short delay
        setTimeout(typeNextChar, 1000);
    }
});
