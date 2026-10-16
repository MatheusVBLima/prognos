"use client"

import { useState } from "react"
import { useQueryState } from "nuqs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Play, Download, Mic, Wand2, Volume2, Edit3, Save, Headphones, TrendingUp, Search, Eye } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const voiceOptions = [
  { id: "alloy", name: "Alloy", description: "Balanced, versatile voice that works for any content" },
  { id: "echo", name: "Echo", description: "Clear, professional male voice, great for tutorials" },
  { id: "fable", name: "Fable", description: "Warm female voice, perfect for storytelling" },
  { id: "onyx", name: "Onyx", description: "Deep, authoritative male voice" },
  { id: "nova", name: "Nova", description: "Young, energetic female voice, great for TikTok" },
  { id: "shimmer", name: "Shimmer", description: "Soft, elegant female voice" },
]

function parseHints(value: string | null): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export default function StudioClient() {
  // Type-safe search params via nuqs
  const [trend] = useQueryState('trend')
  const [score] = useQueryState('score')
  const [description] = useQueryState('description')
  const [hintsParam] = useQueryState('hints')
  
  // Facts and hooks passed from an opportunity as a JSON array
  const hints = parseHints(hintsParam)

  // Whether a trend was passed in
  const hasTrendData = trend && description

  const [tone, setTone] = useState("")
  const [script, setScript] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState(voiceOptions[4]) // Nova by default for TikTok
  const [isVoiceDialogOpen, setIsVoiceDialogOpen] = useState(false)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Extract only the spoken lines from the script
  const extractSpokenText = (fullScript: string) => {
    const lines = fullScript.split('\n')
    const spokenLines: string[] = []
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      const lowerLine = trimmedLine.toLowerCase()
      
      // Spoken lines start with "Narration:"
      if (lowerLine.startsWith('narration:')) {
        const cleanText = trimmedLine.substring('narration:'.length).trim()
        
        if (cleanText) {
          spokenLines.push(cleanText)
        }
      }
    }
    
    return spokenLines.join(' ').trim()
  }

  const generateScript = async () => {
    if (!tone.trim()) return
    
    setIsGenerating(true)
    setScript("")
    
    try {
      const response = await fetch('/api/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trend, tone, score, description, hints }),
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
      console.error('Failed to generate script:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateAudio = async () => {
    if (!script.trim()) return
    
    setIsGeneratingAudio(true)
    
    try {
      const spokenText = extractSpokenText(script)
      
      if (!spokenText.trim()) {
        alert('No spoken text found in the script. Make sure narration lines start with "Narration:".')
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

      if (response.ok) {
        const audioBlob = await response.blob()
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
      } else {
        console.error('Failed to generate audio')
      }
    } catch (error) {
      console.error('Failed to generate audio:', error)
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  const downloadAudio = () => {
    if (!audioUrl) return
    
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = `${trend}-audio.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const downloadScript = () => {
    if (!script.trim()) return
    
    const blob = new Blob([script], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${trend}-script.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // No trend selected yet: point the user to the dashboard
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
                  Script Studio
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                  To start writing scripts, pick an opportunity on the Opportunities page first.
                </p>
                
                <div className="space-y-4">
                  <Link href="/dashboard/trends">
                    <Button className="gap-2" size="lg">
                      <TrendingUp className="w-5 h-5" />
                      See opportunities
                    </Button>
                  </Link>
                  
                  <p className="text-sm text-muted-foreground">
                    Open an opportunity and click "Write script" to generate tailored
                    short-form content.
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
              <h1 className="text-2xl font-bold">Script Studio</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{trend}</Badge>
                {score && <Badge variant="secondary">Score {score}</Badge>}
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
                  Script preview
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
                        Save
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
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
                      <p className="text-muted-foreground">Generating script...</p>
                    </div>
                  </div>
                ) : script ? (
                  isEditing ? (
                    <Textarea
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      className="w-full h-full min-h-[360px] resize-none border-none bg-transparent text-sm font-mono"
                      placeholder="Edit your script here..."
                    />
                  ) : (
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap">{script}</div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Set a tone and click "Generate script" to begin</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Audio player */}
              {audioUrl && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Headphones className="w-4 h-4" />
                    Audio generated with {selectedVoice.name}
                  </Label>
                  <div className="flex items-center gap-2">
                    <audio controls className="flex-1">
                      <source src={audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
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
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Script tone */}
              <div className="space-y-2">
                <Label htmlFor="tone">1. Script tone</Label>
                <Textarea
                  id="tone"
                  placeholder="e.g. funny, informative, dramatic..."
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  rows={3}
                />
                <Button onClick={generateScript} disabled={!tone.trim() || isGenerating} className="w-full">
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate script'}
                </Button>
              </div>

              <Separator />

              {/* Voice */}
              <div className="space-y-2">
                <Label>2. Voice</Label>
                <Dialog open={isVoiceDialogOpen} onOpenChange={setIsVoiceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Mic className="w-4 h-4 mr-2" />
                      {selectedVoice.name} - {selectedVoice.description}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Choose a voice (OpenAI TTS)</DialogTitle>
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
                
                {/* Script download */}
                <Button 
                  onClick={downloadScript} 
                  disabled={!script.trim()} 
                  className="w-full" 
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download script (TXT)
                </Button>

                {/* Spoken text preview */}
                {script.trim() && (
                  <Button 
                    onClick={() => {
                      const spokenText = extractSpokenText(script)
                      if (spokenText.trim()) {
                        alert(`Text that will be spoken:\n\n${spokenText}`)
                      } else {
                        alert('No spoken text found in the script.')
                      }
                    }} 
                    className="w-full"
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" /> Preview spoken text
                  </Button>
                )}

                {/* Generate audio */}
                <Button 
                  onClick={generateAudio} 
                  disabled={!script.trim() || isGeneratingAudio} 
                  className="w-full"
                  variant="default"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  {isGeneratingAudio ? 'Generating audio...' : `Generate audio with ${selectedVoice.name}`}
                </Button>
                
                {/* Audio download */}
                {audioUrl && (
                  <Button 
                    onClick={downloadAudio} 
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download MP3
                  </Button>
                )}
                
                <p className="text-xs text-muted-foreground">
                  {script.trim() ? 
                    `Only the narration lines are read aloud; scene directions are skipped.` :
                    `Audio is generated with OpenAI using the "${selectedVoice.name}" voice.`
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