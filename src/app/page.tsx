'use client';

import Globe3D from '@/components/mvpblocks/3dglobe';
import Feature1 from '@/components/mvpblocks/feature-1';
import SimplePricing from '@/components/mvpblocks/simple-pricing';
import FooterGlow from '@/components/mvpblocks/footer-glow';
import BentoGrid1 from '@/components/mvpblocks/bento-grid-1';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-[#0a0613] to-[#150d27] text-foreground">
      <Globe3D />
      <Feature1 />
      <BentoGrid1 />
      <SimplePricing />
      <FooterGlow />
    </div>
  );
}
