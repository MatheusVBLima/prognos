'use client';

import { Button } from "@/components/ui/button";
import { TrendChart } from "@/components/trends/TrendChart";

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
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Monitore Tendências em Tempo Real
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Descubra o que o mundo está pesquisando agora. Análise de tendências do Google com insights poderosos para seu negócio.
              </p>
            </div>
            <div className="space-x-4">
              <Button size="lg">
                Começar Gratuitamente
              </Button>
              <Button variant="outline" size="lg">
                Saber Mais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Monitoramento em Tempo Real</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Acompanhe as tendências assim que elas acontecem com atualizações automáticas.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Análise Histórica</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Compare tendências ao longo do tempo e identifique padrões sazonais.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Insights Acionáveis</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Receba recomendações personalizadas baseadas nas tendências relevantes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Visualize as Tendências
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Interface intuitiva para análise de dados em tempo real.
            </p>
          </div>
          <div className="mt-12">
            <TrendChart data={demoData} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center text-white">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Pronto para Começar?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl">
              Junte-se a milhares de profissionais que já utilizam nossa plataforma.
            </p>
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100">
              Criar Conta Grátis
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
