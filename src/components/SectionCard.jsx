import React from 'react';

export function SectionCard({ title, eyebrow, actions, children }) {
    return (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    {eyebrow && (
                        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {eyebrow}
                        </div>
                    )}
                    <h3 className="mt-1 font-display text-lg font-extrabold text-foreground">{title}</h3>
                </div>
                {actions}
            </div>
            {children}
        </div>
    );
}