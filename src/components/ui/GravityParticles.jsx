import React, { useRef, useEffect } from 'react';

const GravityParticles = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;
        let parent = canvas.parentElement;

        const init = () => {
            particles = [];
            // "Works perfectly for up to ~500 particles"
            // Adjust count based on screen area to prevent clutter on small screens
            const area = canvas.width * canvas.height;
            const particleCount = Math.min(400, Math.floor(area / 1000)); // Density control

            // Distribute across 3 layers
            for (let i = 0; i < particleCount; i++) {
                // Random layer 1, 2, or 3
                // Bias slightly towards background (1)
                let layer = 1;
                const r = Math.random();
                if (r > 0.6) layer = 2;
                if (r > 0.9) layer = 3;

                particles.push(new Particle(layer));
            }
        };

        const resizeCanvas = () => {
            // Use getBoundingClientRect for precise fractional dimensions
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            // Set physical pixel resolution
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            // Scale context to match
            ctx.scale(dpr, dpr);

            init();
        };

        const mouse = {
            x: undefined,
            y: undefined
        };

        const handleMouseMove = (e) => {
            // Get correct mouse position relative to canvas
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        // Reset mouse when leaving so particles drift back
        const handleMouseLeave = () => {
            mouse.x = undefined;
            mouse.y = undefined;
        };

        // Use ResizeObserver for robust sizing
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });

        if (parent) {
            resizeObserver.observe(parent);
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave); // Drift back
        // window.addEventListener('resize', resizeCanvas); // ResizeObserver handles this now

        class Particle {
            constructor(layer) {
                // Initial placement random
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;

                // Layer properties (1 = back, 2 = mid, 3 = fore)
                this.layer = layer;

                // "Drift, Don't Run"
                // Velocity based on layer (closer = faster)
                const speedMult = layer * 0.5;
                this.vx = (Math.random() - 0.5) * speedMult;
                this.vy = -(Math.random() * 0.5 + 0.2) * speedMult; // "Antigravity" upward force

                // Visuals
                // "Softness... slight blur or glow" -> we'll simulate this with alpha or gradient
                // Size
                this.radius = Math.random() * 2 * layer + 1; // Bigger in front

                // "Low Opacity: rgba(255, 255, 255, 0.5) or lower"
                this.maxAlpha = 0.5 * (layer / 3); // Front is slightly brighter
                this.alpha = this.maxAlpha;

                // Store original velocity for return behavior
                this.baseVx = this.vx;
                this.baseVy = this.vy;
            }

            update() {
                // 1. Antigravity Movement
                this.x += this.vx;
                this.y += this.vy;

                // 2. Mouse Interaction: Repel
                // "Check distance... If < 100 pixels, push away"
                if (mouse.x !== undefined) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const forceRadius = 200; // Increased slightly for better feel

                    if (distance < forceRadius) {
                        // Calculate repulsion force
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;

                        // Stronger force closer to center
                        const force = (forceRadius - distance) / forceRadius;

                        // Push away
                        const repulsionStrength = 2; // Reduced for slower reaction
                        this.vx -= forceDirectionX * force * repulsionStrength;
                        this.vy -= forceDirectionY * force * repulsionStrength;
                    } else {
                        // "Return: Slowly drift back to original path"
                        // Gently dampen/lerp velocity back to base drift
                        if (this.vx !== this.baseVx) {
                            this.vx += (this.baseVx - this.vx) * 0.02; // Slower return
                        }
                        if (this.vy !== this.baseVy) {
                            this.vy += (this.baseVy - this.vy) * 0.02;
                        }
                    }
                }

                // 3. Screen Wrapping
                // If floats off top, reappear at bottom
                if (this.y < -this.radius) {
                    this.y = canvas.height + this.radius;
                    this.x = Math.random() * canvas.width; // Randomize X readjustment
                }
                // Wrap sides just in case
                if (this.x < -this.radius) this.x = canvas.width + this.radius;
                if (this.x > canvas.width + this.radius) this.x = -this.radius;

                this.draw();
            }

            draw() {
                ctx.beginPath();
                // "Softness... radial gradient that fades"
                // Native gradient is expensive for 500 particles, let's use globalAlpha + arc first.
                // Or create a soft edge visual.
                // Simple version with low opacity works well.

                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const animate = () => {
            // Clear with transparency to maintain trail/blur or just clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => p.update());
            animationFrameId = requestAnimationFrame(animate);
        };

        // Initial setup
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
            // window.removeEventListener('resize', resizeCanvas);
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none w-full h-full"
            style={{ display: 'block' }}
        />
    );
};

export default GravityParticles;
