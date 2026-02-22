import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function MatrixButton({
    children,
    to,
    onClick,
    type = "button"
}) {

    const canvasRef = useRef(null);
    const [hover, setHover] = useState(false);

    const isLink = Boolean(to);

    useEffect(() => {
        if (!hover) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let width, height;

        const resize = () => {
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;

            canvas.width = width;
            canvas.height = height;
        };

        resize();

        const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const fontSize = 12;
        const columns = Math.floor(width / fontSize);

        const drops = new Array(columns).fill(0);

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = "#65B156";
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {

                const text =
                    chars[Math.floor(Math.random() * chars.length)];

                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.fillText(text, x, y);

                if (y > height && Math.random() > 0.96) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };

        const interval = setInterval(draw, 35);

        return () => clearInterval(interval);

    }, [hover]);


    const Wrapper = isLink ? Link : "button";

    const wrapperProps = isLink
        ? { to }
        : { type, onClick };


    return (
        <Wrapper
            {...wrapperProps}

            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}

            className="
      relative inline-flex items-center justify-center
      overflow-hidden
      px-8 py-3 rounded-md font-medium text-lg
      bg-accent text-black
      border border-accent
      transition-all duration-300
      hover:bg-transparent hover:text-accent
      "
        >

            {/* Matrix Canvas */}
            <canvas
                ref={canvasRef}
                className={`
        absolute inset-0
        pointer-events-none
        transition-opacity duration-300
        ${hover ? "opacity-40" : "opacity-0"}
        `}
            />

            {/* Text */}
            <span className="relative z-10">
                {children}
            </span>

        </Wrapper>
    );
}