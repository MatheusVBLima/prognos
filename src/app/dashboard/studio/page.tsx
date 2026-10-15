import { Metadata } from 'next'
import StudioClient from '@/components/dashboard/StudioClient'

export const metadata: Metadata = {
  title: 'Script Studio | Prognos',
  description: 'Write AI-generated TikTok scripts based on trending topics',
}

export default function StudioPage() {
  return <StudioClient />
}