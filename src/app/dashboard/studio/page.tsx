import { Metadata } from 'next'
import StudioClient from '@/components/dashboard/StudioClient'

export const metadata: Metadata = {
  title: 'Studio de Roteiros | Prognos',
  description: 'Crie roteiros para TikTok com IA baseados em tendências populares',
}

export default function StudioPage() {
  return <StudioClient />
}