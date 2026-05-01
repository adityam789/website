'use client'

import React, { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import styled from 'styled-components'
import { tokens } from '../../lib/dmp/tokens'
import ProceedPrompt from './ProceedPrompt'

const HeroContainer = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: ${tokens.maxWidth};
  margin: 0 auto;
  padding: 10vh 1.5rem;
`

const TopLabel = styled.div`
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${tokens.textMuted};
  margin-bottom: 1.5rem;
`

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em;
`

const MetadataRow = styled(motion.div)`
  font-family: ${tokens.fontMono};
  font-size: 0.875rem;
  color: ${tokens.green};
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${tokens.border};
  width: 100%;
  margin: 2rem 0;
`

const AbstractBlock = styled(motion.div)`
  margin-bottom: 3rem;
`

const Label = styled.div`
  font-family: ${tokens.fontMono};
  color: ${tokens.green};
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`

const BodyText = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  color: ${tokens.text};
  margin: 0;
`

const BootSequenceContainer = styled.div`
  font-family: ${tokens.fontMono};
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
`

const BootLine = styled(motion.div)`
  display: flex;
  gap: 0.5rem;
`

const BootStatus = styled.span<{ $status: 'ok' | 'warn' }>`
  color: ${({ $status }) => ($status === 'warn' ? tokens.yellow : tokens.green)};
`

const ProgressWrapper = styled.div`
  margin-top: 1rem;
`

const ProgressLabel = styled.div<{ $ready?: boolean }>`
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
  color: ${({ $ready }) => ($ready ? tokens.green : tokens.textMuted)};
  margin-bottom: 0.5rem;
`

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${tokens.surfaceAlt};
  border-radius: ${tokens.radiusPill};
  overflow: hidden;
`

const ProgressBarFill = styled(motion.div)`
  height: 100%;
  background-color: ${tokens.green};
`

const ScrollIndicator = styled(motion.div)`
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
  color: ${tokens.textMuted};
  text-align: center;
  margin-top: auto;
  padding-top: 4rem;
`

const BOOT_LINES = [
  { text: 'calibrating awkward texting...', status: 'ok' as const },
  { text: 'warming up cooking playlist...', status: 'ok' as const },
  { text: 'loading trail maps...', status: 'ok' as const },
  { text: '49ers_season_heartbreak_recovery.exe... still running', status: 'warn' as const },
  { text: 'EQ module (beta)... still patching...', status: 'warn' as const },
  { text: 'charm.exe loaded successfully', status: 'ok' as const },
]

export default function ActOneRFC({ onProceed }: { onProceed?: () => void }) {
  const prefersReducedMotion = useReducedMotion()
  const [activeBootLines, setActiveBootLines] = useState<number>(0)
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveBootLines(BOOT_LINES.length)
      setProgress(100)
      return
    }

    const interval = setInterval(() => {
      setActiveBootLines((prev) => {
        if (prev < BOOT_LINES.length) return prev + 1
        clearInterval(interval)
        setTimeout(() => setProgress(100), 400)
        return prev
      })
    }, 400)

    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  const titleWords = "RFC-2026: A Formal Proposal for Companionship".split(" ")

  return (
    <HeroContainer id="act-one">
      <TopLabel>REQUEST FOR COMMENTS — HUMAN RELATIONS DIVISION</TopLabel>
      
      <Title>
        {titleWords.map((word, i) => (
          <motion.span
            key={i}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            {word}
          </motion.span>
        ))}
      </Title>

      <MetadataRow
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span>Author: Aditya | Age: 24 | Status: 🟢 OPEN</span>
        <br />
        <span>Category: Human Relations | Last Updated: {mounted ? new Date().toLocaleDateString() : '...'}</span>
      </MetadataRow>

      <Divider />

      <AbstractBlock
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Label>{'>'} abstract</Label>
        <BodyText>
          Before Claude replaces all boyfriend-shaped humans with Claude Men™, 
          this document formally proposes giving one (1) dummy a chance. 
          The following specification outlines system capabilities, known bugs, 
          compatibility requirements, and a formal merge request.
        </BodyText>
      </AbstractBlock>

      <BootSequenceContainer aria-live="polite">
        {BOOT_LINES.slice(0, activeBootLines).map((line, i) => (
          <BootLine
            key={i}
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          >
            <span>{'>'} {line.text}</span>
            <BootStatus $status={line.status}>
              {line.status === 'warn' ? '⚠' : '✓'}
            </BootStatus>
          </BootLine>
        ))}
        
        <ProgressWrapper>
          <ProgressLabel $ready={progress === 100}>
            {progress === 100 ? '> READY' : '> system status'}
          </ProgressLabel>
          <ProgressBarTrack>
            <ProgressBarFill 
              initial={prefersReducedMotion ? { width: '100%' } : { width: '0%' }}
              animate={prefersReducedMotion ? { width: '100%' } : { width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </ProgressBarTrack>
        </ProgressWrapper>
      </BootSequenceContainer>

      {progress === 100 && (
        <ProceedPrompt nextActId="act-two" onProceed={onProceed} />
      )}
    </HeroContainer>
  )
}
