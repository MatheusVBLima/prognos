"use client"

import { useEffect } from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts"

// Definindo o tipo para os dados
interface TrendDataPoint {
  timestamp: string
  value: number
  term: string
}

interface TrendChartProps {
  data: TrendDataPoint[]
}

// Função para formatar a data
const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR')
  } catch (error) {
    console.error("Erro formatando data:", dateStr, error)
    return dateStr
  }
}

// Componente de tooltip personalizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-md">
        <p className="text-sm font-medium">{formatDate(label)}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center mt-1">
            <div 
              className="w-3 h-3 mr-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm text-gray-700">{entry.name}: <span className="font-medium">{entry.value}</span></p>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function TrendChart({ data }: TrendChartProps) {
  // Debug - analisar estrutura de dados
  useEffect(() => {
    console.log("TrendChart dados recebidos:", data)
  }, [data])

  // Verificar se temos dados válidos
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Nenhum dado disponível
      </div>
    )
  }

  // Normalizar os dados para garantir formato correto
  const normalizedData = data.map(item => {
    // Garantir que timestamp seja string e tenha um formato de data válido
    const timestamp = typeof item.timestamp === 'string' 
      ? item.timestamp 
      : new Date().toISOString();
    
    // Garantir que value seja número
    const value = typeof item.value === 'number' 
      ? item.value 
      : typeof item.value === 'string' 
        ? parseInt(item.value, 10) || 0 
        : 0;
    
    // Garantir que term seja string
    const term = typeof item.term === 'string' 
      ? item.term 
      : `Tendência ${Math.random().toString(36).substr(2, 5)}`;
    
    return { timestamp, value, term };
  });

  // Organizar dados por termo
  const terms = [...new Set(normalizedData.map(item => item.term))];
  
  // Cores para cada termo
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00C49F", 
                 "#FFBB28", "#FF8042", "#AF19FF", "#FF9E01"];

  // Para debug: criar um conjunto único de timestamps para o eixo X
  const uniqueTimestamps = [...new Set(normalizedData.map(item => item.timestamp))];
  console.log("Timestamps únicos:", uniqueTimestamps);
  console.log("Termos únicos:", terms);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="timestamp" 
          tickFormatter={formatDate}
          allowDuplicatedCategory={false}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        
        {terms.map((term, index) => {
          const termData = normalizedData.filter(item => item.term === term);
          console.log(`Dados para o termo "${term}":`, termData);
          
          return (
            <Line 
              key={term}
              type="monotone"
              dataKey="value"
              data={termData}
              name={term}
              stroke={colors[index % colors.length]}
              activeDot={{ r: 8 }}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  )
} 