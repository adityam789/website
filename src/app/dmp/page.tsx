'use client'

import React, { useState } from 'react'
import ActOneRFC from '../../components/dmp/ActOneRFC'
import ActTwoAppStore from '../../components/dmp/ActTwoAppStore'
import ActThreeJira from '../../components/dmp/ActThreeJira'
import ActFourPR from '../../components/dmp/ActFourPR'
import { dmpConfig } from '../../lib/dmp/config'

export default function DmpPage() {
  const isLocked = dmpConfig.navigationMode === 'locked'
  const [visibleCount, setVisibleCount] = useState(isLocked ? 1 : 4)

  // Sync state if config changes during dev
  React.useEffect(() => {
    setVisibleCount(isLocked ? 1 : 4)
  }, [isLocked])

  const incrementVisible = () => {
    if (isLocked) {
      setVisibleCount(prev => Math.min(prev + 1, 4))
    }
  }

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '5vh' }} suppressHydrationWarning>
      <ActOneRFC onProceed={incrementVisible} />
      
      {visibleCount >= 2 && (
        <ActTwoAppStore onProceed={incrementVisible} />
      )}
      
      {visibleCount >= 3 && (
        <ActThreeJira onProceed={incrementVisible} />
      )}
      
      {visibleCount >= 4 && (
        <ActFourPR />
      )}
    </main>
  )
}
