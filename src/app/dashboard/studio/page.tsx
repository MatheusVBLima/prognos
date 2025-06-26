"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Play, Download, Mic, Wand2, Volume2, Edit3, Save, Headphones, TrendingUp, Search } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const voiceOptions = [
  { id: "alloy", name: "Alloy", description: "Voz equilibrada e versátil, boa para qualquer tipo de conteúdo" },
  { id: "echo", name: "Echo", description: "Voz masculina clara e profissional, ideal para tutoriais" },
  { id: "fable", name: "Fable", description: "Voz feminina calorosa, perfeita para storytelling" },
  { id: "onyx", name: "Onyx", description: "Voz masculina profunda e autoritativa" },
  { id: "nova", name: "Nova", description: "Voz feminina jovem e energética, ideal para TikTok" },
  { id: "shimmer", name: "Shimmer", description: "Voz feminina suave e elegante" },
]

export default function StudioPage() {
  const searchParams = useSearchParams()
  const trend = searchParams.get('trend') || ''
  const rank = searchParams.get('rank') || ''
  const volume = searchParams.get('volume') || ''
  const description = searchParams.get('description') || ''
  const hintsParam = searchParams.get('hints') || '[]'
  const hints = JSON.parse(decodeURIComponent(hintsParam))

  // Verificar se há dados de trend
  const hasTrendData = trend && description

  const [tone, setTone] = useState("")
  const [script, setScript] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState(voiceOptions[4]) // Nova por padrão para TikTok
  const [isVoiceDialogOpen, setIsVoiceDialogOpen] = useState(false)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Função para extrair apenas o texto falado do roteiro
  const extractSpokenText = (fullScript: string) => {
    console.log('🎤 Roteiro completo recebido:')
    console.log(fullScript)
    console.log('📝 Analisando linha por linha...')
    
    const lines = fullScript.split('\n')
    const spokenLines: string[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()
      
      console.log(`Linha ${i + 1}: "${trimmed}"`)
      
      // Pular linhas vazias
      if (!trimmed) {
        console.log(`  ⏭️ Pulando linha vazia`)
        continue
      }
      
      // Pular instruções de cena [...]
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        console.log(`  🎬 Pulando instrução de cena: ${trimmed}`)
        continue
      }
      
      // Pular marcadores de seção **...**
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        console.log(`  📍 Pulando marcador de seção: ${trimmed}`)
        continue
      }
      
      // Pular linhas que são só marcadores como "Música final animada."
      if (trimmed.toLowerCase().includes('música') && trimmed.length < 50) {
        console.log(`  🎵 Pulando marcador de música: ${trimmed}`)
        continue
      }
      
      // Detectar padrões de texto falado
      const lowerLine = trimmed.toLowerCase()
      
      // Padrões de narração/texto falado
      const spokenPatterns = [
        'narração:', 
        'texto/narração:', 
        'texto narração:', 
        'voz:',
        'fala:',
        'narrador:'
      ]
      
      let isSpokenText = false
      for (const pattern of spokenPatterns) {
        if (lowerLine.startsWith(pattern)) {
          const cleanText = trimmed.replace(/^[^:]+:\s*/, '').replace(/"/g, '').trim()
          if (cleanText) {
            console.log(`  🎤 TEXTO FALADO encontrado: "${cleanText}"`)
            spokenLines.push(cleanText)
          }
          isSpokenText = true
          break
        }
      }
      
      if (isSpokenText) continue
      
      // Pular explicitamente padrões que NÃO são texto falado
      const skipPatterns = [
        'texto na tela:', 
        'texto:', 
        'on-screen:', 
        'visual:', 
        'imagem:',
        'cena:',
        'legenda:'
      ]
      
      let shouldSkip = false
      for (const pattern of skipPatterns) {
        if (lowerLine.startsWith(pattern)) {
          console.log(`  ❌ Pulando texto visual: ${trimmed}`)
          shouldSkip = true
          break
        }
      }
      
      if (shouldSkip) continue
      
      // Se não tem ":" no início, pode ser continuação de narração
      if (!trimmed.includes(':') && trimmed.length > 10) {
        console.log(`  📝 Possível continuação de narração: "${trimmed}"`)
        spokenLines.push(trimmed)
      } else {
        console.log(`  ⚠️ Linha ignorada: "${trimmed}"`)
      }
    }
    
    const result = spokenLines.join(' ')
    console.log('🎯 RESULTADO FINAL:')
    console.log(`Total de linhas faladas: ${spokenLines.length}`)
    console.log(`Texto completo: "${result}"`)
    
    return result
  }

  const generateScript = async () => {
    if (!tone.trim()) return
    
    setIsGenerating(true)
    setScript("")
    
    try {
      const response = await fetch('/api/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trend, tone, rank, volume, description, hints }),
      })

      if (!response.body) return

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        setScript(prev => prev + chunk)
      }
    } catch (error) {
      console.error('Erro ao gerar roteiro:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateAudio = async () => {
    if (!script.trim()) return
    
    setIsGeneratingAudio(true)
    
    try {
      // Extrair apenas o texto falado
      const spokenText = extractSpokenText(script)
      
      console.log('Texto extraído para áudio:', spokenText)
      
      if (!spokenText.trim()) {
        alert('Nenhum texto falado encontrado no roteiro! Verifique se há texto sem marcadores de cena.')
        return
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: spokenText, 
          voice: selectedVoice.id 
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar áudio')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      // Limpar URL anterior se existir
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      
      // Definir nova URL para o player
      setAudioUrl(url)
      
    } catch (error) {
      console.error('Erro ao gerar áudio:', error)
      alert('Erro ao gerar áudio. Verifique se a chave da OpenAI está configurada.')
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  const downloadAudio = () => {
    if (!audioUrl) return
    
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = `roteiro-${trend.replace(/\s+/g, '-')}-${selectedVoice.name}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const downloadScript = () => {
    const blob = new Blob([script], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roteiro-${trend.replace(/\s+/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Se não há dados de trend, mostrar tela de seleção
  if (!hasTrendData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="pt-16 pb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Search className="w-12 h-12 text-primary" />
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold mb-4">
                  Studio de Roteiros
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                  Para começar a criar roteiros, você precisa selecionar uma tendência no dashboard principal.
                </p>
                
                <div className="space-y-4">
                  <Link href="/dashboard">
                    <Button className="gap-2" size="lg">
                      <TrendingUp className="w-5 h-5" />
                      Explorar Tendências
                    </Button>
                  </Link>
                  
                  <p className="text-sm text-muted-foreground">
                    Navegue pelas tendências populares e clique em "Usar essa trend para criar roteiro" 
                    para gerar conteúdo personalizado para TikTok.
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen space-y-4">
      {/* Header */}
      <div className="border-b bg-card rounded-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Studio de Roteiros</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{trend}</Badge>
                <Badge variant="secondary">#{rank}</Badge>
                <Badge variant="outline">{volume}+ pesquisas</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Preview Card */}
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Preview do Roteiro
                </div>
                {script && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Editar
                      </>
                    )}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full space-y-4">
              <div className="h-[400px] bg-muted rounded-lg p-4 overflow-y-auto">
                {isGenerating ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                        <Wand2 className="w-8 h-8 mx-auto mb-2 text-primary" />
                      </motion.div>
                      <p className="text-muted-foreground">Gerando roteiro...</p>
                    </div>
                  </div>
                ) : script ? (
                  isEditing ? (
                    <Textarea
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      className="w-full h-full min-h-[360px] resize-none border-none bg-transparent text-sm font-mono"
                      placeholder="Edite seu roteiro aqui..."
                    />
                  ) : (
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap">{script}</div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Defina o tom e clique em "Gerar Roteiro" para começar</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Player de Áudio */}
              {audioUrl && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Headphones className="w-4 h-4" />
                    Áudio gerado com {selectedVoice.name}
                  </Label>
                  <div className="flex items-center gap-2">
                    <audio controls className="flex-1">
                      <source src={audioUrl} type="audio/mpeg" />
                      Seu navegador não suporta o elemento de áudio.
                    </audio>
                    <Button onClick={downloadAudio} variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Controls Card */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Tom do Roteiro */}
              <div className="space-y-2">
                <Label htmlFor="tone">1. Tom do Roteiro</Label>
                <Textarea
                  id="tone"
                  placeholder="Ex: quero um vídeo cômico, informativo, dramático..."
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  rows={3}
                />
                <Button onClick={generateScript} disabled={!tone.trim() || isGenerating} className="w-full">
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Gerando...' : 'Gerar Roteiro'}
                </Button>
              </div>

              <Separator />

              {/* Escolha de Voz */}
              <div className="space-y-2">
                <Label>2. Escolha da Voz</Label>
                <Dialog open={isVoiceDialogOpen} onOpenChange={setIsVoiceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Mic className="w-4 h-4 mr-2" />
                      {selectedVoice.name} - {selectedVoice.description}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Escolha uma Voz (OpenAI TTS)</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {voiceOptions.map((voice) => (
                        <Card
                          key={voice.id}
                          className={`cursor-pointer transition-colors ${
                            selectedVoice.id === voice.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => {
                            setSelectedVoice(voice)
                            setIsVoiceDialogOpen(false)
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Volume2 className="w-5 h-5 text-primary" />
                              <div>
                                <h4 className="font-medium">{voice.name}</h4>
                                <p className="text-sm text-muted-foreground">{voice.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Separator />

              {/* Download */}
              <div className="space-y-3">
                <Label>3. Downloads</Label>
                
                {/* Download Roteiro */}
                <Button 
                  onClick={downloadScript} 
                  disabled={!script.trim()} 
                  className="w-full" 
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar roteiro (TXT)
                </Button>

                {/* Preview do texto falado */}
                {script.trim() && (
                  <Button 
                    onClick={() => {
                      const spokenText = extractSpokenText(script)
                      console.log('Script completo:', script)
                      console.log('Linhas processadas:', script.split('\n').map((line, i) => `${i+1}: ${line}`))
                      console.log('Texto extraído:', spokenText)
                      
                      if (spokenText.trim()) {
                        alert(`Texto que será falado:\n\n${spokenText}`)
                      } else {
                        alert('Nenhum texto falado encontrado! Verifique o console para debug.')
                      }
                    }} 
                    className="w-full"
                    variant="outline"
                    size="sm"
                  >
                    👁️ Visualizar texto que será falado
                  </Button>
                )}

                {/* Gerar Áudio */}
                <Button 
                  onClick={generateAudio} 
                  disabled={!script.trim() || isGeneratingAudio} 
                  className="w-full"
                  variant="default"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  {isGeneratingAudio ? 'Gerando áudio...' : `Gerar áudio com ${selectedVoice.name}`}
                </Button>
                
                {/* Download Áudio Separado */}
                {audioUrl && (
                  <Button 
                    onClick={downloadAudio} 
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar MP3
                  </Button>
                )}
                
                <p className="text-xs text-muted-foreground">
                  {script.trim() ? 
                    `A IA extrairá automaticamente apenas o texto falado (removendo instruções de cena, etc.)` :
                    `O áudio será gerado usando IA da OpenAI com a voz "${selectedVoice.name}"`
                  }
                </p>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 