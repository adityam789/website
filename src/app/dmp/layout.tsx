import { Metadata } from 'next'
import StyledComponentsRegistry from '../../components/dmp/StyledComponentsRegistry'
import { GlobalDmpStyles } from '../../styles/dmp/GlobalDmpStyles'

export const metadata: Metadata = {
  title: 'RFC-2026: A Formal Proposal for Companionship',
  description: 'Before Claude replaces boyfriends with Claude Men™, give this idiot a chance.',
  openGraph: {
    title: 'RFC-2026 · Date Me Please',
    description: 'A formally engineered dating profile.',
    url: 'https://mahi.run/dmp'
  }
}

export default function DmpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StyledComponentsRegistry>
      <GlobalDmpStyles />
      {children}
    </StyledComponentsRegistry>
  )
}
