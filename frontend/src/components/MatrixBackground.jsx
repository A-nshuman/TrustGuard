import { useEffect, useRef } from "react";

export default function MatrixBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener("resize", resize);

        // Characters
        const chars =
            "01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%&*";

        const fontSize = 16;
        const columns = canvas.width / fontSize;

        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * canvas.height;
        }

        // Animation
        const draw = () => {
            // Fade effect
            ctx.fillStyle = "rgba(5, 10, 20, 0.08)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${fontSize}px monospace`;
            ctx.fillStyle = "#65B156"; // Accent Green

            for (let i = 0; i < drops.length; i++) {
                const text =
                    chars[Math.floor(Math.random() * chars.length)];

                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.fillText(text, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", resize);
        };

    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-30"
        />
    );
}