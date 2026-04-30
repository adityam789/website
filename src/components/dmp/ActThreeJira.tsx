'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import { tokens } from '../../lib/dmp/tokens'
import TerminalTransition from './TerminalTransition'
import ProceedPrompt from './ProceedPrompt'

const Section = styled.section`
  padding-top: clamp(60px, 10vh, 100px);
  max-width: ${tokens.maxWidth};
  margin: 0 auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
`

const TicketWrapper = styled.div`
  background: ${tokens.surfaceAlt};
  border: 1px solid ${tokens.border};
  border-radius: 12px;
  padding: 1.5rem;
`

const Breadcrumb = styled.div`
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
  color: ${tokens.textMuted};
  margin-bottom: 1rem;
`

const TicketTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.3;
`

const StatusBadge = styled(motion.button)<{ $status: string }>`
  background: ${({ $status }) => 
    $status === 'OPEN' ? tokens.yellow : 
    $status === 'IN REVIEW' ? '#4da6ff' : tokens.green};
  color: ${tokens.bg};
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: ${tokens.radiusPill};
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 1.5rem;
`

const MetadataPillsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

const Pill = styled.div`
  background: ${tokens.surfaceAlt};
  border: 1px solid ${tokens.border};
  border-radius: ${tokens.radiusPill};
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const DescriptionBox = styled.div`
  border: 1px solid ${tokens.border};
  border-radius: ${tokens.radiusSm};
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  line-height: 1.6;
`

const SectionLabel = styled.div`
  font-family: ${tokens.fontMono};
  color: ${tokens.textMuted};
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
`

const Checklist = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

const CheckItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
`

const CheckboxUI = styled.div`
  width: 16px;
  height: 16px;
  border: 1px dashed ${tokens.textMuted};
  border-radius: 4px;
  flex-shrink: 0;
  margin-top: 2px;
`

const SpecBlock = styled.div`
  background: ${tokens.surfaceAlt};
  border-left: 3px solid ${tokens.green};
  padding: 1rem;
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  white-space: pre-wrap;
`

const BugsTable = styled.div`
  margin-bottom: 2rem;
`

const BugRow = styled.div<{ $header?: boolean }>`
  display: grid;
  grid-template-columns: 140px 100px 1fr;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${tokens.border};
  font-size: 0.75rem;
  font-family: ${tokens.fontMono};
  color: ${({ $header }) => ($header ? tokens.textMuted : tokens.text)};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`

const BugSeverity = styled.span<{ $level: 'LOW' | 'MEDIUM' }>`
  color: ${({ $level }) => ($level === 'MEDIUM' ? tokens.yellow : tokens.green)};
`

const CommentsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const CommentBlock = styled(motion.div)`
  display: flex;
  gap: 0.75rem;
`

const Avatar = styled.div<{ $primary?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $primary }) => ($primary ? tokens.green : tokens.surfaceAlt)};
  color: ${({ $primary }) => ($primary ? tokens.bg : tokens.text)};
  border: ${({ $primary }) => ($primary ? 'none' : `1px solid ${tokens.border}`)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
  flex-shrink: 0;
`

const CommentContent = styled.div`
  flex: 1;
`

const CommentMeta = styled.div`
  font-size: 0.75rem;
  color: ${tokens.textMuted};
  margin-bottom: 0.25rem;
`

const CommentBody = styled.div`
  font-size: 0.875rem;
  line-height: 1.5;
  background: ${tokens.surfaceAlt};
  padding: 0.75rem 1rem;
  border-radius: 0 12px 12px 12px;
`

const STATUS_STATES = ['OPEN', 'IN REVIEW', 'AWAITING MERGE']

export default function ActThreeJira({ onProceed }: { onProceed?: () => void }) {
  const [revealed, setRevealed] = useState(false)
  const [statusIndex, setStatusIndex] = useState(0)

  const currentStatus = STATUS_STATES[statusIndex]

  const cycleStatus = () => {
    setStatusIndex((prev) => (prev + 1) % STATUS_STATES.length)
  }

  const specText = `REQUIRED:          honesty, humor, appetite (food + life)
OPTIONAL:          fellow foodie, adventure curious, dog person
INCOMPATIBLE_WITH: people unwilling to give it a real shot
NOTE:              outcome = relationship || friendship. both valid. both ship.`

  return (
    <Section id="act-three">
      <TerminalTransition 
        lines={['fetching ticket MAHI-001...']} 
        onComplete={() => setRevealed(true)} 
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={revealed ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <TicketWrapper>
          <Breadcrumb>LIFE / Human Relations / MAHI-001</Breadcrumb>
          <TicketTitle>[FEATURE] Seeking Long-Term Relationship</TicketTitle>
          
          <AnimatePresence mode="wait">
            <StatusBadge
              key={currentStatus}
              $status={currentStatus}
              onClick={cycleStatus}
              title="click to update status"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {currentStatus}
            </StatusBadge>
          </AnimatePresence>

          <MetadataPillsRow>
            <Pill>🔴 Priority: High</Pill>
            <Pill>♾ Story Points: ∞</Pill>
            <Pill>🏃 Sprint: Currently Running</Pill>
            <Pill>📁 Epic: Life</Pill>
            <Pill>👤 Reporter: aditya</Pill>
            <Pill>❓ Assignee: TBD</Pill>
          </MetadataPillsRow>

          <DescriptionBox>
            Looking for someone to give this an honest shot. Not asking for 
            perfection — asking for empathy, humor, and loyalty. The hallmark 
            of a good relationship is a rage baiter and the rage baited. So 
            looking for someone who has what it takes to bully me, and then 
            go get dessert after.
          </DescriptionBox>

          <SectionLabel>Acceptance Criteria</SectionLabel>
          <Checklist>
            <CheckItem><CheckboxUI /> Willing to give it an honest shot</CheckItem>
            <CheckItem><CheckboxUI /> Has what it takes to bully me, then get dessert after</CheckItem>
            <CheckItem><CheckboxUI /> Will share tea — herbal OR verbal, both accepted</CheckItem>
            <CheckItem><CheckboxUI /> Enjoys late night walks, off-tangent conversations, sunsets</CheckItem>
            <CheckItem><CheckboxUI /> Empathy ✓ Humor ✓ Loyalty ✓</CheckItem>
          </Checklist>

          <SpecBlock>{specText}</SpecBlock>

          <BugsTable>
            <BugRow $header>
              <div>BUG</div><div>SEVERITY</div><div>NOTES</div>
            </BugRow>
            <BugRow>
              <div>EQ_MODULE</div>
              <div><BugSeverity $level="MEDIUM">MEDIUM</BugSeverity></div>
              <div>actively patching. not a blocker.</div>
            </BugRow>
            <BugRow>
              <div>FIRST_CONTACT</div>
              <div><BugSeverity $level="LOW">LOW</BugSeverity></div>
              <div>awkward texter. resolves post-warmup. wontfix (it's a feature)</div>
            </BugRow>
            <BugRow>
              <div>ADVENTURE_INERTIA</div>
              <div><BugSeverity $level="LOW">LOW</BugSeverity></div>
              <div>high latency to start, zero latency once rolling</div>
            </BugRow>
          </BugsTable>

          <CommentsSection>
            <CommentBlock
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
            >
              <Avatar $primary>A</Avatar>
              <CommentContent>
                <CommentMeta>aditya · just now</CommentMeta>
                <CommentBody>I promise the awkward texting is temporary. The cooking is permanent.</CommentBody>
              </CommentContent>
            </CommentBlock>

            <CommentBlock
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ delay: 0.1 }}
            >
              <Avatar>V1</Avatar>
              <CommentContent>
                <CommentMeta>verified_friend_01 · 2 days ago</CommentMeta>
                <CommentBody>Can confirm he will listen to your gossip for hours. Genuinely. It's unsettling how good he is at it.</CommentBody>
              </CommentContent>
            </CommentBlock>

            <CommentBlock
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ delay: 0.2 }}
            >
              <Avatar>V2</Avatar>
              <CommentContent>
                <CommentMeta>verified_friend_02 · 5 days ago</CommentMeta>
                <CommentBody>Super nice. I am legally required to say this but also it's true.</CommentBody>
              </CommentContent>
            </CommentBlock>
          </CommentsSection>

          <ProceedPrompt nextActId="act-four" onProceed={onProceed} />
        </TicketWrapper>
      </motion.div>
    </Section>
  )
}
