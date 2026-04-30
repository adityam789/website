'use client'

import { createGlobalStyle } from 'styled-components'
import { tokens } from '../../lib/dmp/tokens'

export const GlobalDmpStyles = createGlobalStyle`
  :root {
    --dmp-bg: #f9f9f9;
    --dmp-surface: #ffffff;
    --dmp-surface-alt: #f3f3f3;
    --dmp-text: #1a1a18;
    --dmp-text-muted: rgba(26,26,24,0.5);
    --dmp-green: #1a9c2d;
    --dmp-yellow: #d99c00;
    --dmp-red: #d93d36;
    --dmp-border: rgba(0,0,0,0.1);
    --dmp-border-hover: rgba(0,0,0,0.2);
  }

  .dark {
    --dmp-bg: #0f0f0e;
    --dmp-surface: #1a1a18;
    --dmp-surface-alt: #1e1e1c;
    --dmp-text: #f0ede8;
    --dmp-text-muted: rgba(240,237,232,0.45);
    --dmp-green: #28c840;
    --dmp-yellow: #febc2e;
    --dmp-red: #ff5f57;
    --dmp-border: rgba(255,255,255,0.08);
    --dmp-border-hover: rgba(255,255,255,0.16);
  }

  html, body {
    margin: 0;
    padding: 0;
    background-color: var(--dmp-bg);
    color: var(--dmp-text);
    font-family: ${tokens.fontSans};
    scroll-behavior: smooth;
    
    /* Hide scrollbar for entire page but keep functionality */
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  * {
    box-sizing: border-box;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
`
