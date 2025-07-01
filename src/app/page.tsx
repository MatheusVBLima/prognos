'use client';

import { Button } from "@/components/ui/button";
import { TrendChart } from "@/components/trends/TrendChart";
import Link from "next/link";

// Dados de exemplo para o gráfico
const demoData = [
  { timestamp: '2024-04-01', value: 65, term: 'Exemplo' },
  { timestamp: '2024-04-02', value: 59, term: 'Exemplo' },
  { timestamp: '2024-04-03', value: 80, term: 'Exemplo' },
  { timestamp: '2024-04-04', value: 81, term: 'Exemplo' },
  { timestamp: '2024-04-05', value: 56, term: 'Exemplo' },
  { timestamp: '2024-04-06', value: 55, term: 'Exemplo' },
  { timestamp: '2024-04-07', value: 40, term: 'Exemplo' },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
     <Link href="/dashboard">
      <Button>
        Dashboard
      </Button>
     </Link>
    </div>
  );
}
