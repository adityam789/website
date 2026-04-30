'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import { tokens } from '../../lib/dmp/tokens'

const PromptContainer = styled(motion.div)`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px dashed ${tokens.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`

const QuestionText = styled.div`
  font-family: ${tokens.fontMono};
  font-size: 0.875rem;
  color: ${tokens.text};
`

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
`

const ActionButton = styled.button<{ $variant: 'yes' | 'no' }>`
  background: ${tokens.surfaceAlt};
  color: ${({ $variant }) => ($variant === 'yes' ? tokens.green : tokens.textMuted)};
  border: 1px solid ${tokens.border};
  border-radius: ${tokens.radiusSm};
  padding: 0.5rem 1.5rem;
  font-family: ${tokens.fontMono};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ $variant }) => ($variant === 'yes' ? tokens.green : tokens.borderHover)};
    color: ${({ $variant }) => ($variant === 'yes' ? tokens.green : tokens.text)};
  }
`

const RejectionMessage = styled(motion.div)`
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
  color: ${tokens.yellow};
  text-align: center;
  max-width: 400px;
  min-height: 20px;
`

const REJECTIONS = [
  "Error: 'No' button is currently undergoing maintenance. Please use 'Yes'.",
  "I see you clicked 'No'. That was a cute test of my error handling.",
  "Look, my mom thinks I'm a catch. Don't make her sad.",
  "sudo click_yes --force",
  "Are you sure? I make really good pasta.",
  "Button 'No' has been deprecated in v24.0."
]

export default function ProceedPrompt({ nextActId, onProceed }: { nextActId: string; onProceed?: () => void }) {
  const [rejectionCount, setRejectionCount] = useState(0)

  const handleYes = () => {
    onProceed?.()
    setTimeout(() => {
      const el = document.getElementById(nextActId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  const handleNo = () => {
    setRejectionCount((prev) => prev + 1)
  }

  const currentRejection = rejectionCount > 0 
    ? REJECTIONS[(rejectionCount - 1) % REJECTIONS.length] 
    : ""

  return (
    <PromptContainer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <QuestionText>{'>'} Proceed to next module? [Y/n]</QuestionText>
      
      <ButtonRow>
        <ActionButton $variant="yes" onClick={handleYes}>
          [ YES ]
        </ActionButton>
        <ActionButton $variant="no" onClick={handleNo}>
          [ NO ]
        </ActionButton>
      </ButtonRow>

      <AnimatePresence mode="wait">
        {currentRejection && (
          <RejectionMessage
            key={currentRejection}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {currentRejection}
          </RejectionMessage>
        )}
      </AnimatePresence>
    </PromptContainer>
  )
}
