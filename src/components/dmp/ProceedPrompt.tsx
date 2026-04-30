'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import { tokens } from '../../lib/dmp/tokens'

const NO_LABELS = [
  "[ NO ]",
  "[ no? ]",
  "[ still no ]",
  "[ really? ]",
  "[ ...okay ]",
  "[ noted ]",
  "[ fine ]",
  "[ ur loss ]",
  "[ :(( ]",
  "[ okay bye ]",
  "[ gone ]",
]

const REJECTIONS = [
  "oh. okay. that's fine. i'm fine. totally fine.",
  "i mean, i did warn you i was an awkward texter. this tracks.",
  "no worries. someone else will eat the pasta i was going to make.",
  "worst case we become friends, remember? the offer still stands.",
  "my friends said this was a great idea. i'm going to tell them they were wrong.",
  "noted. filing this under 'known bugs: shipping anyway'.",
  "i was going to suggest a late night walk and bad conversation. your loss honestly.",
  "this is fine. i have snacks. i will recover.",
  "okay but herbal or verbal tea, the offer has no expiry date.",
  "alright. i hope whoever gets a yes from you knows how lucky they are. 🍵",
]

const GateContainer = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  border-top: 1px solid ${tokens.border};
  border-bottom: 1px solid ${tokens.border};
  margin: 2rem 0;
  overflow: hidden;
`

const PromptText = styled.p`
  font-family: ${tokens.fontMono};
  font-size: 14px;
  color: ${tokens.text};
  margin-bottom: 1.5rem;
`

const ButtonArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`

const YesButton = styled(motion.button)`
  font-family: ${tokens.fontMono};
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  border: 1px solid ${tokens.green};
  color: ${tokens.green};
  border-radius: ${tokens.radiusSm};
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  position: relative;
  z-index: 2;
  outline: none;
`

const Tooltip = styled(motion.div)`
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-family: ${tokens.fontMono};
  font-size: 11px;
  color: ${tokens.green};
  white-space: nowrap;
  pointer-events: none;
`

const NoButton = styled(motion.button)`
  font-family: ${tokens.fontMono};
  font-size: 13px;
  background: transparent;
  border: 1px solid ${tokens.border};
  color: ${tokens.textMuted};
  border-radius: ${tokens.radiusSm};
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  white-space: nowrap;
  outline: none;
  z-index: 100;
  position: absolute;
`

const MessageBox = styled.div`
  min-height: 2rem;
  margin-top: 1.25rem;
`

const RejectionText = styled(motion.p)`
  font-family: ${tokens.fontMono};
  font-size: 13px;
  color: ${tokens.textMuted};
  font-style: italic;
  margin: 0;
`

export default function ProceedPrompt({ nextActId, onProceed }: { nextActId: string; onProceed?: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [noCount, setNoCount] = useState(0)
  const [noPos, setNoPos] = useState({ x: 75, y: 0 }) 
  const [behaviorMode, setBehaviorMode] = useState<'escape' | 'shrink'>('escape')
  const [escapeCount, setEscapeCount] = useState(0) // Track jumps in the current turn
  const [isHoveringYes, setIsHoveringYes] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const noRef = useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleYesClick = () => {
    onProceed?.()
    setTimeout(() => {
      const el = document.getElementById(nextActId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  const handleNoHover = () => {
    // If we're in shrink mode, or if the button has already escaped 3 times this turn, stay still.
    if (!containerRef.current || !noRef.current || behaviorMode === 'shrink' || escapeCount >= 3) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const buttonRect = noRef.current.getBoundingClientRect()
    const safeMargin = 16

    const maxMoveX = (containerRect.width / 2) - (buttonRect.width / 2) - safeMargin
    const maxMoveY = (containerRect.height / 2) - (buttonRect.height / 2) - safeMargin

    let newX = (Math.random() * 2 - 1) * maxMoveX
    let newY = (Math.random() * 2 - 1) * maxMoveY

    if (Math.abs(newX) < 60 && Math.abs(newY) < 40) {
      newX += Math.sign(newX + 0.1) * 60
      newY += Math.sign(newY + 0.1) * 40
    }

    setNoPos({ x: newX, y: newY })
    setEscapeCount(prev => prev + 1)
  }

  const handleNoClick = () => {
    setNoCount(prev => prev + 1)
    setEscapeCount(0) // Reset escape count for the next turn
    setNoPos({ x: 75, y: 0 }) // Return to home position after a successful click
    // Randomly pick next behavior mode (70% chance of being stubborn/escaping)
    setBehaviorMode(Math.random() > 0.3 ? 'escape' : 'shrink')
  }

  // Behavior B values
  const clampedNoCount = Math.min(noCount, 10)
  const yesScale = 1 + (clampedNoCount * 0.06)
  const yesGlow = `0 0 ${clampedNoCount * 8}px rgba(40, 200, 64, ${clampedNoCount * 0.04})`
  const noScale = Math.max(0.5, 1 - (clampedNoCount * 0.04))
  const noOpacity = Math.max(0.25, 1 - (clampedNoCount * 0.07))

  // Pulse animation for YES button after noCount >= 8
  const yesAnimate = clampedNoCount >= 8 
    ? { scale: [yesScale, yesScale * 1.04, yesScale], boxShadow: yesGlow }
    : { scale: yesScale, boxShadow: yesGlow }

  const yesTransition = (clampedNoCount >= 8
    ? { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
    : { duration: 0.4 }) as any

  if (!mounted) return <GateContainer style={{ minHeight: '180px' }} />

  return (
    <GateContainer>
      <PromptText>{'>'} Proceed to next module? [Y/n]</PromptText>
      
      <ButtonArea ref={containerRef}>
        <YesButton
          onClick={handleYesClick}
          onMouseEnter={() => setIsHoveringYes(true)}
          onMouseLeave={() => setIsHoveringYes(false)}
          whileHover={{ scale: yesScale * 1.03 }}
          whileTap={{ scale: yesScale * 0.97 }}
          animate={yesAnimate}
          transition={yesTransition}
          style={{ x: -75 }} // Anchored 75px to the left of the center
        >
          <AnimatePresence>
            {noCount >= 3 && isHoveringYes && (
              <Tooltip
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                good choice 🍵
              </Tooltip>
            )}
          </AnimatePresence>
          [ YES ]
        </YesButton>

        <NoButton
          ref={noRef}
          animate={{ 
            x: noPos.x, 
            y: noPos.y, 
            scale: noScale, 
            opacity: noOpacity 
          }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          onMouseEnter={handleNoHover}
          onClick={handleNoClick}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={noCount + (escapeCount >= 3 ? '-tired' : '')}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'inline-block' }}
            >
              {escapeCount >= 3 
                ? "[ ...fine ]" 
                : NO_LABELS[Math.min(noCount, NO_LABELS.length - 1)]
              }
            </motion.span>
          </AnimatePresence>
        </NoButton>
      </ButtonArea>

      <MessageBox>
        <AnimatePresence mode="wait">
          {noCount > 0 && (
            <RejectionText
              key={noCount}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {REJECTIONS[Math.min(noCount - 1, REJECTIONS.length - 1)]}
            </RejectionText>
          )}
        </AnimatePresence>
      </MessageBox>
    </GateContainer>
  )
}
