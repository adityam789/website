'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import { Terminal, Star, ChevronDown, Mountain, ChefHat, Plane } from 'lucide-react'
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

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`

const AppIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 14px;
  background: ${tokens.surfaceAlt};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.green};
  border: 1px solid ${tokens.border};
`

const AppInfo = styled.div`
  flex: 1;
`

const AppName = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
`

const AppTagline = styled.p`
  margin: 0.25rem 0;
  color: ${tokens.textMuted};
  font-size: 0.875rem;
`

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${tokens.textMuted};
  margin-top: 0.25rem;
`

const Stars = styled.div`
  display: flex;
  gap: 2px;
  color: ${tokens.yellow};
`

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`

const ButtonPill = styled.button<{ $variant?: 'outline' }>`
  background: ${({ $variant }) => ($variant === 'outline' ? 'transparent' : tokens.green)};
  color: ${({ $variant }) => ($variant === 'outline' ? tokens.text : tokens.bg)};
  border: ${({ $variant }) => ($variant === 'outline' ? `1px solid ${tokens.border}` : 'none')};
  padding: 0.5rem 1.25rem;
  border-radius: ${tokens.radiusPill};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`

const CollapsibleSection = styled.div`
  margin-bottom: 2rem;
`

const CollapsibleHeader = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: ${tokens.green};
  font-family: ${tokens.fontMono};
  font-size: 0.875rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  cursor: pointer;
  margin-bottom: 1rem;
`

const ReleaseNotesBlock = styled(motion.div)`
  background: ${tokens.surfaceAlt};
  border: 1px solid ${tokens.border};
  border-radius: ${tokens.radius};
  padding: 1rem;
  font-family: ${tokens.fontMono};
  font-size: 0.875rem;
  line-height: 1.5;
  overflow: hidden;
`

const HorizontalRow = styled(motion.div)`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  margin-bottom: 0.5rem;
  padding-bottom: 1rem;
`

const ScreenshotCard = styled.div`
  min-width: 160px;
  height: 280px;
  background: ${tokens.surfaceAlt};
  border: 1px solid ${tokens.border};
  border-radius: ${tokens.radius};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
`

const ScreenshotLabel = styled.div`
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
  color: ${tokens.textMuted};
  margin-top: auto;
  padding-bottom: 1rem;
  z-index: 1;
`

const MutedNote = styled.div`
  font-family: ${tokens.fontMono};
  font-size: 0.75rem;
  color: ${tokens.textMuted};
  font-style: italic;
  margin-bottom: 2rem;
`

const Description = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`

const ReviewCard = styled(motion.div)`
  min-width: 260px;
  background: ${tokens.surfaceAlt};
  border: 1px solid ${tokens.border};
  border-radius: ${tokens.radiusSm};
  padding: 1rem;
  flex-shrink: 0;
`

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

const InfoTable = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }
`

const InfoRow = styled.div`
  display: contents;
`

const InfoLabel = styled.div`
  font-family: ${tokens.fontMono};
  color: ${tokens.textMuted};
  font-size: 0.875rem;
  border-bottom: 1px solid ${tokens.border};
  padding: 0.75rem 0;
  
  @media (max-width: 640px) {
    border-bottom: none;
    padding-bottom: 0;
  }
`

const InfoValue = styled.div`
  font-size: 0.875rem;
  border-bottom: 1px solid ${tokens.border};
  padding: 0.75rem 0;
`

export default function ActTwoAppStore({ onProceed }: { onProceed?: () => void }) {
  const [revealed, setRevealed] = useState(false)
  const [notesOpen, setNotesOpen] = useState(true)

  return (
    <Section id="act-two">
      <TerminalTransition 
        lines={['opening app_store.exe']} 
        onComplete={() => setRevealed(true)} 
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={revealed ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <HeaderRow>
          <AppIcon>
            <Terminal size={32} />
          </AppIcon>
          <AppInfo>
            <AppName>Aditya™</AppName>
            <AppTagline>An easy going, nerd for your adventures</AppTagline>
            <RatingRow>
              <Stars>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={tokens.yellow} />)}
              </Stars>
              4.8 · 24 ratings · Free · No In-App Purchases
            </RatingRow>
            <ButtonRow>
              <ButtonPill 
                as="a" 
                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Get
              </ButtonPill>
              <ButtonPill 
                as="a" 
                $variant="outline" 
                href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
              >
                Share ↗
              </ButtonPill>
            </ButtonRow>
          </AppInfo>
        </HeaderRow>

        <CollapsibleSection>
          <CollapsibleHeader onClick={() => setNotesOpen(!notesOpen)}>
            WHAT'S NEW IN v24.0
            <motion.div animate={{ rotate: notesOpen ? 180 : 0 }}>
              <ChevronDown size={16} />
            </motion.div>
          </CollapsibleHeader>
          
          <AnimatePresence initial={false}>
            {notesOpen && (
              <ReleaseNotesBlock
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                • Improved EQ module (still in beta, shipping fast)<br/>
                • Fixed: introvert mode now transitions to ambivert after warmup<br/>
                • Added: new cooking recipes, trail routes<br/>
                • Known regression: first texts still occasionally awkward
              </ReleaseNotesBlock>
            )}
          </AnimatePresence>
        </CollapsibleSection>

        <HorizontalRow drag="x" dragConstraints={{ left: -300, right: 0 }}>
          <ScreenshotCard>
            {/* <Image src="/assets/dmp/hiking.jpg" alt="hiking" fill style={{ objectFit: 'cover' }} /> */}
            <Mountain size={32} color={tokens.textMuted} />
            <ScreenshotLabel>hiking</ScreenshotLabel>
          </ScreenshotCard>
          <ScreenshotCard>
            {/* <Image src="/assets/dmp/cooking.jpg" alt="cooking" fill style={{ objectFit: 'cover' }} /> */}
            <ChefHat size={32} color={tokens.textMuted} />
            <ScreenshotLabel>cooking</ScreenshotLabel>
          </ScreenshotCard>
          <ScreenshotCard>
            {/* <Image src="/assets/dmp/adventure.jpg" alt="adventure" fill style={{ objectFit: 'cover' }} /> */}
            <Plane size={32} color={tokens.textMuted} />
            <ScreenshotLabel>somewhere nice</ScreenshotLabel>
          </ScreenshotCard>
        </HorizontalRow>
        <MutedNote>// placeholder — replace with actual photos</MutedNote>

        <Description>
          An easy going, ambitious, and nerd enjoying small adventures 
          and making good friends along the way.
        </Description>

        <HorizontalRow drag="x" dragConstraints={{ left: -400, right: 0 }}>
          <ReviewCard>
            <ReviewHeader>
              <Stars>{[...Array(5)].map((_, i) => <Star key={i} size={12} fill={tokens.yellow} />)}</Stars>
              <span style={{fontFamily: tokens.fontMono, color: tokens.textMuted}}>verified_friend_01</span>
            </ReviewHeader>
            "Will literally cook for you. 10/10 feature."
          </ReviewCard>
          
          <ReviewCard>
            <ReviewHeader>
              <Stars>{[...Array(5)].map((_, i) => <Star key={i} size={12} fill={tokens.yellow} />)}</Stars>
              <span style={{fontFamily: tokens.fontMono, color: tokens.textMuted}}>verified_friend_02</span>
            </ReviewHeader>
            "Terrible texter at first. Magnificent human after."
          </ReviewCard>
          
          <ReviewCard>
            <ReviewHeader>
              <Stars>{[...Array(4)].map((_, i) => <Star key={i} size={12} fill={tokens.yellow} />)}<Star size={12} color={tokens.textMuted} /></Stars>
              <span style={{fontFamily: tokens.fontMono, color: tokens.textMuted}}>hiking_group</span>
            </ReviewHeader>
            "Said 'let's go' to a 6am hike. Actually showed up."
          </ReviewCard>
        </HorizontalRow>

        <InfoTable>
          <InfoRow><InfoLabel>Size</InfoLabel><InfoValue>5'10"</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Category</InfoLabel><InfoValue>Human / Companion</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Compatibility</InfoLabel><InfoValue>Most personality types</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Languages</InfoLabel><InfoValue>English, Sarcasm, Food</InfoValue></InfoRow>
          <InfoRow><InfoLabel>VEGETARIAN</InfoLabel><InfoValue>true</InfoValue></InfoRow>
          <InfoRow><InfoLabel>ADVENTURE_READY</InfoLabel><InfoValue>true (latency: ~15min)</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Kids</InfoLabel><InfoValue>Don't have · not sure yet</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Religion</InfoLabel><InfoValue>Hindu</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Zodiac</InfoLabel><InfoValue>Libra ♎</InfoValue></InfoRow>
        </InfoTable>

        <ProceedPrompt nextActId="act-three" onProceed={onProceed} />
      </motion.div>
    </Section>
  )
}
