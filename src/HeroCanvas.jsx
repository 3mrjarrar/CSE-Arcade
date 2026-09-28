import React, { useEffect, useRef } from 'react';

const palette = ['22, 190, 218', '71, 139, 242', '157, 111, 238', '244, 127, 164', '250, 188, 59', '43, 197, 165'];

export default function HeroCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const hero = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, frame = 0, last = 0, visible = true, tick = 0;
    let particles = [], trail = [];
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false, strength: 0 };

    function draw(now = 0) {
      frame = 0;
      if (!visible || document.hidden) return;
      if (!reduced.matches && now - last < 32) { frame = requestAnimationFrame(draw); return; }
      const delta = Math.min((now - last) / 32 || 1, 2);
      last = now;
      if (!reduced.matches) tick += .009 * delta;
      mouse.x += (mouse.targetX - mouse.x) * .16;
      mouse.y += (mouse.targetY - mouse.y) * .16;
      mouse.strength += ((mouse.active ? 1 : 0) - mouse.strength) * .08;
      ctx.clearRect(0, 0, width, height);

      // Soft pools of color fill the entire section, following the pointer gently.
      palette.forEach((color, i) => {
        const baseX = width * ((i + .5) / palette.length);
        const baseY = height * (.46 + Math.sin(i * 2.1 + tick) * .3);
        const x = baseX + (mouse.x - width / 2) * .1 * mouse.strength;
        const y = baseY + (mouse.y - height / 2) * .12 * mouse.strength;
        const radius = Math.min(width * .3, 290);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
        glow.addColorStop(0, `rgba(${color}, .25)`);
        glow.addColorStop(.5, `rgba(${color}, .10)`);
        glow.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      });

      // A dotted field bends around the cursor like a flexible arcade board.
      for (let x = 16; x < width; x += 32) for (let y = 16; y < height; y += 32) {
        const dx = x - mouse.x, dy = y - mouse.y;
        const distance = Math.hypot(dx, dy);
        const force = Math.max(0, 1 - distance / 155) * mouse.strength;
        ctx.beginPath();
        ctx.arc(x + dx * force * .28, y + dy * force * .28, 1 + force * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(58, 126, 171, ${.14 + force * .24})`;
        ctx.fill();
      }

      particles.forEach((p, i) => {
        const homeX = p.x * width + Math.sin(tick + i) * 12;
        const homeY = p.y * height + Math.cos(tick * .8 + i) * 12;
        const dx = homeX - mouse.x, dy = homeY - mouse.y;
        const force = Math.max(0, 1 - Math.hypot(dx, dy) / 180) * mouse.strength;
        const x = homeX + dx * force * .6, y = homeY + dy * force * .6;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.angle + tick * .15);
        ctx.strokeStyle = `rgba(${palette[i % palette.length]}, ${.5 + force * .35})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        if (i % 3 === 0) { ctx.moveTo(-p.size, 0); ctx.lineTo(p.size, 0); ctx.moveTo(0, -p.size); ctx.lineTo(0, p.size); }
        else if (i % 3 === 1) ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
        else ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      trail = trail.filter(p => p.life > 0);
      trail.forEach(p => {
        p.life -= .035 * delta;
        p.x += p.vx * delta; p.y += p.vy * delta;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, p.life) * p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.life) * .65})`;
        ctx.fill();
      });
      if (!reduced.matches) frame = requestAnimationFrame(draw);
    }

    function schedule() { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw); }
    function resize() {
      const rect = hero.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: width < 600 ? 24 : 48 }, (_, i) => ({
        x: ((i * .6180339) % 1), y: ((i * .381966 + .12) % 1), size: 4 + i % 5, angle: i * 1.3,
      }));
      mouse.x = mouse.targetX = width / 2; mouse.y = mouse.targetY = height / 2;
      schedule();
    }
    function move(event) {
      if (reduced.matches) return;
      const rect = hero.getBoundingClientRect();
      mouse.targetX = event.clientX - rect.left;
      mouse.targetY = event.clientY - rect.top;
      mouse.active = true;
      if (trail.length < 45) trail.push({ x: mouse.targetX, y: mouse.targetY, vx: (Math.random() - .5) * 2, vy: (Math.random() - .5) * 2, size: 3 + Math.random() * 5, color: palette[Math.floor(Math.random() * palette.length)], life: 1 });
    }
    function leave() { mouse.active = false; }
    function visibility() { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else schedule(); }
    function preference() { mouse.active = false; mouse.strength = 0; trail = []; cancelAnimationFrame(frame); frame = 0; schedule(); }
    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule(); else { cancelAnimationFrame(frame); frame = 0; }
    });
    resizeObserver.observe(hero); intersection.observe(hero);
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', leave);
    hero.addEventListener('pointerup', leave);
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', preference);
    return () => {
      cancelAnimationFrame(frame); resizeObserver.disconnect(); intersection.disconnect();
      hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', leave); hero.removeEventListener('pointerup', leave);
      document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', preference);
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true"/>;
}
