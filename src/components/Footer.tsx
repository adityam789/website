'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Footer.module.css';

export default function Footer() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    if (mounted && pathname === '/dmp') return null;

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <p className={styles.left}>
                    © 2026 Aditya Maheshwari. built with craft (and too much coffee).
                </p>
                <div className={styles.links}>
                    <Link href="https://github.com/adityam789" target="_blank" rel="noopener noreferrer">github</Link>
                    <Link href="https://linkedin.com/in/aditya-maheshwari-05" target="_blank" rel="noopener noreferrer">linkedin</Link>
                    <Link href="mailto:adityamahesh@umass.edu">email</Link>
                </div>
            </div>
        </footer>
    );
}
