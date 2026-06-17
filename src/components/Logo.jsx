import React from "react";
import { cn } from "../utils/utils.js";

export function Logo({
                         className,
                         size = 36,
                         showWordmark = true,
                         variant = "default"
                     }) {
    const wordmarkColor = variant === "light" ? "text-white" : "text-foreground";
    const ficha = variant === "light" ? "text-white/90" : "text-accent";

    return (
        <div className={cn("flex items-center gap-2.5", className)}>
            <svg
                viewBox="0 0 64 64"
                width={size}
                height={size}
                className="shrink-0 drop-shadow-[0_6px_16px_oklch(0.55_0.11_188/0.35)]"
                aria-hidden="true"
            >
                <rect x="2" y="2" width="60" height="60" rx="16" fill="#0E8C7E" />
                <path
                    d="M16 18 V36 a16 16 0 0 0 32 0 V18"
                    stroke="#FFFFFF"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    fill="none"
                />
                <rect x="28.5" y="22" width="7" height="20" rx="2" fill="#FFFFFF" />
                <rect x="22" y="28.5" width="20" height="7" rx="2" fill="#FFFFFF" />
                <circle cx="50" cy="14" r="4" fill="#1E5BC6" />
            </svg>

            {showWordmark && (
                <div className="leading-none">
                    <div className={cn("font-display text-[1.15rem] font-extrabold tracking-tight", wordmarkColor)}>
                        Uni<span className={ficha}>Ficha</span>
                    </div>
                    <div className={cn("mt-0.5 text-[0.6rem] font-semibold tracking-[0.18em]", variant === "light" ? "text-white/60" : "text-muted-foreground")}>
                        AGENDAMENTO UBS
                    </div>
                </div>
            )}
        </div>
    );
}