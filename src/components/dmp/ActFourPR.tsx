'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { GitMerge } from 'lucide-react'
import { tokens } from '../../lib/dmp/tokens'
import TerminalTransition from './TerminalTransition'
import ConfettiButton from './ConfettiButton'

const Section = styled.section`
  padding-top: clamp(60px, 10vh, 100px);
  padding-bottom: clamp(60px, 10vh, 100px);
  max-width: ${tokens.maxWidth};
  margin: 0 auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
`

const PRHeaderBox = styled.div`
  border: 1px solid ${tokens.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`

const TitleBlock = styled.div`
  flex: 1;
`

const PRTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`

const PRSubtext = styled.div`
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
  color: ${tokens.textMuted};
`

const StatusPill = styled.div`
  background: #6e56cf;
  color: ${tokens.text};
  padding: 0.25rem 0.75rem;
  border-radius: ${tokens.radiusPill};
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const DiffStatsRow = styled.div`
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
`

const Additions = styled.span`
  color: ${tokens.green};
  margin-right: 1rem;
`

const DescriptionBlock = styled.div`
  border-left: 3px solid ${tokens.border};
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-family: ${tokens.fontMono};
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
`

const AdditionLine = styled.span`
  color: ${tokens.green};
`

const ChecklistContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
`

const CheckItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`

const ReviewerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${tokens.border};
`

const ReviewerAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px dashed ${tokens.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.textMuted};
  font-family: ${tokens.fontMono};
`

const ReviewerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const ReviewerName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
`

const ReviewerStatus = styled.div`
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
  color: ${tokens.yellow};
`

const SimplePleasures = styled.div`
  text-align: center;
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
  color: ${tokens.textMuted};
  font-style: italic;
  margin-top: 4rem;
  line-height: 1.6;
`

const CHECKLIST_ITEMS = [
  'Vegetarian friendly',
  'Will not flake on adventures (post-inertia)',
  'Herbal AND verbal tea certified',
  'No Claude Men were harmed in this proposal',
  'Open source (what you see is what you get)',
]

export default function ActFourPR() {
  const [revealed, setRevealed] = useState(false)

  return (
    <Section id="act-four">
      <TerminalTransition 
        lines={['preparing pull_request.exe...']} 
        onComplete={() => setRevealed(true)} 
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={revealed ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <PRHeaderBox>
          <TopRow>
            <TitleBlock>
              <PRTitle>feat: add aditya to your life</PRTitle>
              <PRSubtext>aditya wants to merge → your-life · from: his-life</PRSubtext>
            </TitleBlock>
            <StatusPill>
              <GitMerge size={14} /> Open
            </StatusPill>
          </TopRow>
          
          <DiffStatsRow>
            <Additions>+247 additions −0 deletions</Additions>
            <span style={{ color: tokens.textMuted }}>
              files changed: your weekends, your dinner plans, your walk roster
            </span>
          </DiffStatsRow>

          <DescriptionBlock>
            This PR adds one (1) nerdy, ambitious, easy going guy to your life.{'\n\n'}
            <AdditionLine>+ home cooked meals (vegetarian, actually good)</AdditionLine>{'\n'}
            <AdditionLine>+ someone who genuinely listens to all your gossip</AdditionLine>{'\n'}
            <AdditionLine>+ late night walks and off-tangent conversations</AdditionLine>{'\n'}
            <AdditionLine>+ a rage-baiting partner who will also get dessert with you</AdditionLine>{'\n'}
            <AdditionLine>+ a yes-let's-do-it energy for most adventures</AdditionLine>{'\n\n'}
            Worst case: we become friends.{'\n'}
            Best case: well. let's see. :)
          </DescriptionBlock>

          <ChecklistContainer>
            {CHECKLIST_ITEMS.map((item, i) => (
              <CheckItem
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                ✅ {item}
              </CheckItem>
            ))}
          </ChecklistContainer>

          <ReviewerRow>
            <ReviewerAvatar>?</ReviewerAvatar>
            <ReviewerInfo>
              <ReviewerName>you (reviewer requested)</ReviewerName>
              <ReviewerStatus>Awaiting review...</ReviewerStatus>
            </ReviewerInfo>
          </ReviewerRow>
        </PRHeaderBox>

        <ConfettiButton />

        <SimplePleasures>
          late night walks · cooking · doing grocery ·<br/>
          off-tangent conversations · nice dinner under the sunset
        </SimplePleasures>
      </motion.div>
    </Section>
  )
}
