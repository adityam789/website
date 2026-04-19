'use client';

import { useEffect } from 'react';

export default function ScrollProgress() {
    useEffect(() => {
        const bar = document.getElementById('scroll-progress');
        if (!bar) return;
        const onScroll = () => {
            const doc = document.documentElement;
            const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
            bar.style.width = `${Math.min(pct, 100)}%`;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return <div id="scroll-progress" aria-hidden="true" />;
}
