import React, { useEffect, useRef } from 'react';
import './SakuraRain.css';

interface Petal {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    flutter: number; // Added for 3D-like fluttering effect
    flutterSpeed: number;
}

const SakuraRain: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const petals = useRef<Petal[]>([]);
    const mouse = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createPetals = () => {
            const count = 200; // Dense but light
            petals.current = Array.from({ length: count }).map(() => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 6 + 4,
                speedX: Math.random() * 0.4 - 0.2,
                speedY: Math.random() * 0.6 + 0.4, // Significantly slowed down (Slow Fall)
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 0.3 - 0.15,
                opacity: Math.random() * 0.4 + 0.3,
                flutter: Math.random() * Math.PI,
                flutterSpeed: Math.random() * 0.05 + 0.02
            }));
        };

        resize();
        createPetals();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            petals.current.forEach((p) => {
                // Update Fluttering (3D swaying effect)
                p.flutter += p.flutterSpeed;
                const flutterOffset = Math.sin(p.flutter) * 1.5;

                // Update position
                p.y += p.speedY;
                p.x += p.speedX + flutterOffset * 0.2; // Drifting horizontally
                p.rotation += p.rotationSpeed + flutterOffset * 0.05;

                // Mouse Interaction (Solid Obstacle Diversion)
                const dx = p.x - mouse.current.x;
                const dy = p.y - mouse.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const radius = 60;

                if (distance < radius) {
                    if (p.y < mouse.current.y) {
                        const slideFactor = (radius - distance) / radius;
                        p.x += (dx < 0 ? -1.5 : 1.5) * slideFactor;
                        p.y -= 0.2; // Minimal lift while sliding
                    } else {
                        const pushForce = (radius - distance) / radius;
                        p.x += (dx / distance) * pushForce * 3;
                    }
                }

                // Reset position if out of bounds
                if (p.y > canvas.height) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x > canvas.width) p.x = 0;
                if (p.x < 0) p.x = canvas.width;

                // Draw petal with varying width to simulate "flipping" in 3D
                const currentWidth = p.size * (1 + Math.sin(p.flutter) * 0.2);
                const currentHeight = p.size / 2 * (1 + Math.cos(p.flutter) * 0.3);

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                
                // Draw petal shape
                ctx.beginPath();
                ctx.ellipse(0, 0, currentWidth, currentHeight, 0, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(248, 200, 220, ${p.opacity})`;
                ctx.fill();
                
                // Sakura Notch
                ctx.beginPath();
                ctx.moveTo(currentWidth, 0);
                ctx.arc(currentWidth, 0, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(248, 200, 220, ${p.opacity + 0.1})`;
                ctx.fill();
                
                ctx.restore();
            });

            requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} className="sakura-canvas" />;
};

export default SakuraRain;
