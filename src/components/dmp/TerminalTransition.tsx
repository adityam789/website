'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import styled from 'styled-components'
import { tokens } from '../../lib/dmp/tokens'

interface TerminalTransitionProps {
  lines: string[]
  onComplete?: () => void
}

const TerminalContainer = styled(motion.div)`
  font-family: ${tokens.fontMono};
  font-size: 13px;
  color: ${tokens.green};
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 24px;
`

const LineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const LineText = styled.span``

const StatusIcon = styled.span<{ $status: 'ok' | 'warn' }>`
  color: ${({ $status }) => ($status === 'warn' ? tokens.yellow : tokens.green)};
`

export default function TerminalTransition({ lines, onComplete }: TerminalTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const prefersReducedMotion = useReducedMotion()

  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [typedChars, setTypedChars] = useState('')
  const [completedLines, setCompletedLines] = useState<number[]>([])

  useEffect(() => {
    if (!inView) return

    if (currentLineIndex >= lines.length) {
      onComplete?.()
      return
    }

    const currentFullLine = lines[currentLineIndex]

    if (typedChars.length < currentFullLine.length) {
      const timeout = setTimeout(() => {
        setTypedChars(currentFullLine.slice(0, typedChars.length + 1))
      }, prefersReducedMotion ? 0 : 28)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setCompletedLines((prev) => [...prev, currentLineIndex])
        setCurrentLineIndex((prev) => prev + 1)
        setTypedChars('')
      }, prefersReducedMotion ? 0 : 150)
      return () => clearTimeout(timeout)
    }
  }, [inView, currentLineIndex, typedChars, lines, onComplete, prefersReducedMotion])

  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: inView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.4, ease: 'easeOut' as const },
      }

  return (
    <TerminalContainer ref={ref} {...animationProps}>
      {lines.map((line, index) => {
        const isCompleted = completedLines.includes(index)
        const isCurrent = index === currentLineIndex
        
        if (index > currentLineIndex) return null

        const displayText = isCompleted ? line : typedChars
        const isWarn = line.toLowerCase().includes('patching') || line.toLowerCase().includes('beta')

        return (
          <LineRow key={index}>
            <LineText>{'>'} {displayText}</LineText>
            {isCompleted && (
              <StatusIcon $status={isWarn ? 'warn' : 'ok'}>
                {isWarn ? '⚠' : '✓'}
              </StatusIcon>
            )}
          </LineRow>
        )
      })}
    </TerminalContainer>
  )
}
