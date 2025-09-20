// app/not-found.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import './not-found.css';

export default function NotFound() {
  useEffect(() => {
    // Simple particle animation
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }> = [];

    const colors = ['#6fe7ff', '#3498db', '#8e44ad', '#2ecc71'];

    for (let i = 0; i < 100; i++) {
      const size = Math.random() * 3 + 1;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const speedX = (Math.random() - 0.5) * 1;
      const speedY = (Math.random() - 0.5) * 1;
      const color = colors[Math.floor(Math.random() * colors.length)];

      particles.push({ x, y, size, speedX, speedY, color });
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Wrap around edges
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="not-found-container">
      <canvas id="particle-canvas" className="particle-canvas"></canvas>
      
      <div className="not-found-content">
        <div className="animation-container">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
          <div className="number-404">404</div>
        </div>
        
        <h1 className="error-title">Oops! Page Not Found</h1>
        <p className="error-description">
          The page you&apos;re looking for seems to have drifted into the digital void. 
          Let&apos;s help you find your way back to familiar territory.
        </p>
        
        <div className="action-buttons">
          <Link href="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Contact Support
          </Link>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="decoration-circle" style={{ top: '20%', left: '10%' }}></div>
      <div className="decoration-square" style={{ top: '70%', right: '15%' }}></div>
      <div className="decoration-circle" style={{ bottom: '30%', left: '20%' }}></div>
    </div>
  );
}