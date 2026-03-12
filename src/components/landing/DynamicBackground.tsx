import React, { useEffect, useRef } from 'react';

/**
 * DynamicBackground - Renderiza um gráfico de linha dinâmico (estilo spline)
 * e partículas brilhantes interativas usando HTML5 Canvas para máximo desempenho.
 * Inspirado em designs modernos tech/trading.
 */
const DynamicBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // --- Configuração das Partículas ---
        const PARTICLE_COUNT = 150;
        const particles: { x: number, y: number, radius: number, vx: number, vy: number, baseAlpha: number, color: string }[] = [];
        const colors = ['#34d399', '#2dd4bf', '#818cf8', '#fbbf24', '#f472b6']; // Emerald, Cyan, Indigo, Amber, Pink

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                baseAlpha: Math.random() * 0.4 + 0.1,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        // --- Configuração das Linhas Guias (Grid sutil) ---
        const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = 0; x < w; x += 60) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
            }
            for (let y = 0; y < h; y += 60) {
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
            }
            ctx.stroke();
        };

        // --- Configuração da Linha Spline (Trade Chart Simulado) ---
        const POINTS_COUNT = 10;
        let points: { x: number, y: number, targetY: number, speed: number, offset: number }[] = [];
        
        const initPoints = () => {
             points = [];
             const spacing = width / (POINTS_COUNT - 1);
             for (let i = 0; i < POINTS_COUNT; i++) {
                 const startY = height * 0.5 + (Math.random() - 0.5) * (height * 0.4);
                 points.push({
                     x: i * spacing,
                     y: startY,
                     targetY: startY,
                     speed: Math.random() * 0.01 + 0.005,
                     offset: Math.random() * Math.PI * 2
                 });
             }
        };
        initPoints();

        // --- Interatividade do Mouse (Antigravity Feel) ---
        let mouseX = width / 2;
        let mouseY = height / 2;
        let mouseVelocityX = 0;
        let mouseVelocityY = 0;
        let lastMouseX = mouseX;
        let lastMouseY = mouseY;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const handleMouseLeave = () => {
            // Volta pro centro quando o mouse sai
            mouseX = width / 2;
            mouseY = height / 2;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initPoints();
        };
        window.addEventListener('resize', handleResize);

        let animationFrameId: number;
        let time = 0;

        const draw = () => {
            time += 0.01;
            
            // Calculando a velocidade do mouse pros efeitos
            mouseVelocityX = mouseX - lastMouseX;
            mouseVelocityY = mouseY - lastMouseY;
            lastMouseX = mouseX;
            lastMouseY = mouseY;
            
            ctx.clearRect(0, 0, width, height);

            // 0. Grid Sutil no fundo
            drawGrid(ctx, width, height);

            // 1. Atualizar e desenhar pontos (Gráfico de Linha Flutuante)
            ctx.beginPath();
            
            for (let i = 0; i < POINTS_COUNT; i++) {
                // Evolução orgânica dos pontos do gráfico
                if (Math.random() < 0.01) {
                    points[i].targetY = height * 0.5 + (Math.random() - 0.5) * (height * 0.4);
                }
                
                // Interpolação suave para o target
                points[i].y += (points[i].targetY - points[i].y) * points[i].speed;
                
                // Oscilação baseada no tempo
                const currentY = points[i].y + Math.sin(time + points[i].offset) * (height * 0.05);

                // Interação fluida do mouse com a linha principal
                let pushedY = currentY;
                if (i > 0 && i < POINTS_COUNT - 1) {
                    const dx = mouseX - points[i].x;
                    const dy = mouseY - currentY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 400) { // Raio de influência grande
                        // Efeito antigravidade suave - puxa a linha na direção da gravidade do mouse
                        pushedY += dy * 0.03 * (1 - dist/400); 
                    }
                }
                points[i].y = pushedY;
            }

            // Desenhar a curva suavizada
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 0; i < POINTS_COUNT - 1; i++) {
                const xc = (points[i].x + points[i + 1].x) / 2;
                const yc = (points[i].y + points[i + 1].y) / 2;
                ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            ctx.quadraticCurveTo(points[POINTS_COUNT - 1].x, points[POINTS_COUNT - 1].y, points[POINTS_COUNT - 1].x, points[POINTS_COUNT - 1].y);
            
            // Estilo da linha do gráfico (Gradiente dinâmico verde/azul)
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, 'rgba(52, 211, 153, 0)');
            gradient.addColorStop(0.2, 'rgba(52, 211, 153, 0.4)'); // Emerald
            gradient.addColorStop(0.5, 'rgba(45, 212, 191, 0.8)'); // Teal
            gradient.addColorStop(0.8, 'rgba(56, 189, 248, 0.4)'); // Sky blue
            gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 4;
            ctx.shadowColor = 'rgba(45, 212, 191, 0.6)';
            ctx.shadowBlur = 15;
            ctx.stroke();

            // Sombra pra dar profundidade
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
            ctx.stroke();

            // 2. Atualizar e desenhar partículas espaciais tipo poeira galáctica
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const p = particles[i];
                
                // Movimento base
                p.x += p.vx;
                p.y += p.vy;

                // Efeito de Parallax: Reação intensa ao mouse que segue o movimento (Antigravity feel)
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Repulsão suave natural
                if (dist < 200) {
                    const force = (200 - dist) / 200;
                    p.x -= (dx / dist) * force * 1.5;
                    p.y -= (dy / dist) * force * 1.5;
                }

                // Arrasto criado pelo movimento rápido do mouse
                const speed = Math.sqrt(mouseVelocityX * mouseVelocityX + mouseVelocityY * mouseVelocityY);
                if (speed > 5 && dist < 300) {
                    p.x += mouseVelocityX * 0.05 * (300 - dist)/300;
                    p.y += mouseVelocityY * 0.05 * (300 - dist)/300;
                }

                // Retorno à tela sem corte seco (trazendo pro lado oposto suavemente)
                if (p.x < -20) p.x = width + 20;
                if (p.x > width + 20) p.x = -20;
                if (p.y < -20) p.y = height + 20;
                if (p.y > height + 20) p.y = -20;

                // Cintilação
                const currentAlpha = p.baseAlpha + Math.sin(time * 3 + i) * 0.3;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0.05, Math.min(0.8, currentAlpha));
                
                // Sombra suave para glow
                if (currentAlpha > 0.4) {
                    ctx.shadowColor = p.color;
                    ctx.shadowBlur = p.radius * 3;
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.fill();
                ctx.globalAlpha = 1.0;
                ctx.shadowBlur = 0; // reset
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ display: 'block' }}
        />
    );
};

export default DynamicBackground;
