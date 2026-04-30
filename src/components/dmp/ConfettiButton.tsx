'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import { Loader2, Check, GitMerge, AtSign } from 'lucide-react'
import { tokens } from '../../lib/dmp/tokens'

const ButtonWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

const MainButton = styled(motion.button)<{ $state: 'idle' | 'merging' | 'merged' }>`
  background: ${({ $state }) => ($state === 'merged' ? '#1f9b31' : tokens.green)};
  color: ${tokens.bg};
  border: none;
  border-radius: ${tokens.radiusPill};
  padding: 0.875rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: ${({ $state }) => ($state === 'idle' ? 'pointer' : 'default')};
  opacity: ${({ $state }) => ($state === 'merging' ? 0.8 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 400px;
`

const RevealCard = styled(motion.div)`
  background: ${tokens.surfaceAlt};
  border: 1px solid ${tokens.green};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`

const RevealTitle = styled.div`
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
  color: ${tokens.green};
  margin-top: 0.5rem;
`

const RevealMainText = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 1rem 0;
`

const InstaLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid ${tokens.border};
  border-radius: ${tokens.radiusPill};
  padding: 0.75rem 1.5rem;
  color: ${tokens.text};
  font-weight: 600;
  font-size: 0.875rem;
  transition: background 0.2s;

  &:hover {
    background: ${tokens.borderHover};
  }
`

const RevealFooter = styled.div`
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
  color: ${tokens.textMuted};
  margin-top: 1.5rem;
`

export default function ConfettiButton() {
  const [state, setState] = useState<'idle' | 'merging' | 'merged'>('idle')

  const handleMerge = async () => {
    if (state !== 'idle') return

    setState('merging')

    setTimeout(async () => {
      setState('merged')

      try {
        const confetti = (await import('canvas-confetti')).default
        
        const duration = 200
        const defaults = {
          origin: { y: 0.7 },
          colors: [tokens.green, tokens.yellow, tokens.text, '#ffffff'],
          scalar: 1.1,
          spread: 80,
        }

        confetti({ ...defaults, particleCount: 180 })
        setTimeout(() => confetti({ ...defaults, particleCount: 180 }), duration)
      } catch (err) {
        console.error('Confetti failed to load', err)
      }
    }, 900)
  }

  return (
    <ButtonWrapper>
      <MainButton
        $state={state}
        onClick={handleMerge}
        whileHover={state === 'idle' ? { scale: 1.02 } : {}}
        whileTap={state === 'idle' ? { scale: 0.98 } : {}}
      >
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div key="idle" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              ✓ Approve & Merge
            </motion.div>
          )}
          {state === 'merging' && (
            <motion.div key="merging" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              Merging...
            </motion.div>
          )}
          {state === 'merged' && (
            <motion.div key="merged" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Check size={18} />
              Merge Successful! 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </MainButton>

      <AnimatePresence>
        {state === 'merged' && (
          <RevealCard
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <GitMerge size={28} color={tokens.green} />
            <RevealTitle>PR merged into: your-life</RevealTitle>
            <RevealMainText>Aditya merged this — say hi 👋</RevealMainText>
            <InstaLink href="https://instagram.com/aditya_mahi05" target="_blank" rel="noopener noreferrer">
              <AtSign size={18} />
              @aditya_mahi05
            </InstaLink>
            <RevealFooter>
              worst case we grab tea. herbal or verbal, your pick. 🍵
            </RevealFooter>
          </RevealCard>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </ButtonWrapper>
  )
}
