"use client"

import { useActionState, useState, useTransition } from "react"
import { Check, Globe, Loader2, PenLine, RefreshCw, Sparkles, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BrandPreview, Swatches } from "@/components/brand/BrandPreview"
import {
  chooseDirectionAction,
  generateDirectionsAction,
  importFromWebsiteAction,
  startFromScratchAction,
} from "@/app/dashboard/brand/actions"
import { PERSONALITY_OPTIONS, VISUAL_STYLES, type BrandDirection } from "@/lib/brand/schema"
import { cn } from "@/lib/utils"

type Props = { projectName: string; websiteUrl: string | null }

export function BrandSetup({ projectName, websiteUrl }: Props) {
  const [scratchPending, startScratch] = useTransition()

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Set up your brand</h1>
        <p className="text-muted-foreground">
          Everything Prognos writes and designs for {projectName} will use these colors, fonts and voice.
        </p>
      </div>

      <Tabs defaultValue={websiteUrl ? "website" : "create"} className="gap-4">
        <TabsList className="h-auto w-full flex-wrap justify-start sm:w-fit">
          <TabsTrigger value="website" className="px-4 py-2">
            <Globe className="size-4" />I have a website
          </TabsTrigger>
          <TabsTrigger value="create" className="px-4 py-2">
            <Wand2 className="size-4" />
            Create a new identity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="website">
          <WebsiteImport defaultUrl={websiteUrl ?? ""} />
        </TabsContent>
        <TabsContent value="create">
          <IdentityWizard projectName={projectName} />
        </TabsContent>
      </Tabs>

      <p className="text-center text-sm text-muted-foreground">
        Already know your colors and fonts?{" "}
        <button
          type="button"
          className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
          disabled={scratchPending}
          onClick={() => startScratch(() => startFromScratchAction())}
        >
          {scratchPending ? <Loader2 className="size-3.5 animate-spin" /> : <PenLine className="size-3.5" />}
          Set them up manually
        </button>
      </p>
    </div>
  )
}

function WebsiteImport({ defaultUrl }: { defaultUrl: string }) {
  const [state, action, pending] = useActionState(importFromWebsiteAction, undefined)

  return (
    <form action={action}>
      <Card>
        <CardHeader>
          <CardTitle>Import your brand from your website</CardTitle>
          <CardDescription>
            We&apos;ll read your landing page to pick up your colors, fonts, logo and the way you talk about your product.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="url">Website</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="url"
              name="url"
              inputMode="url"
              placeholder="example.com"
              defaultValue={state?.url ?? defaultUrl}
              required
              disabled={pending}
            />
            <Button type="submit" disabled={pending} className="sm:w-48">
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {pending ? "Analyzing…" : "Analyze website"}
            </Button>
          </div>
          {state?.error ? (
            <p className="text-sm text-destructive">{state.error}</p>
          ) : pending ? (
            <p className="text-sm text-muted-foreground">Reading your page and studying your brand. This takes a few seconds.</p>
          ) : null}
        </CardContent>
      </Card>
    </form>
  )
}

function IdentityWizard({ projectName }: { projectName: string }) {
  const [state, action, pending] = useActionState(generateDirectionsAction, undefined)
  const [personality, setPersonality] = useState<string[]>([])
  const [style, setStyle] = useState("")
  const [avoid, setAvoid] = useState("")
  const [inspiration, setInspiration] = useState("")
  const errors = state?.fieldErrors ?? {}

  const toggle = (word: string) =>
    setPersonality((current) =>
      current.includes(word) ? current.filter((w) => w !== word) : current.length < 3 ? [...current, word] : current,
    )

  return (
    <div className="space-y-6">
      <form action={action}>
        {personality.map((word) => (
          <input key={word} type="hidden" name="personality" value={word} />
        ))}
        <input type="hidden" name="style" value={style} />
        <Card>
          <CardHeader>
            <CardTitle>Let&apos;s design your identity</CardTitle>
            <CardDescription>Answer three quick questions and we&apos;ll propose three directions to choose from.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <fieldset className="space-y-3">
              <legend className="font-medium">1. Which words describe {projectName}? Pick up to three.</legend>
              <div className="flex flex-wrap gap-2">
                {PERSONALITY_OPTIONS.map((word) => {
                  const selected = personality.includes(word)
                  return (
                    <button
                      key={word}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggle(word)}
                      className={cn(
                        "flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors",
                        selected ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent",
                        !selected && personality.length >= 3 && "opacity-50",
                      )}
                    >
                      {selected && <Check className="size-3.5" />}
                      {word}
                    </button>
                  )
                })}
              </div>
              {errors.personality && <p className="text-sm text-destructive">{errors.personality[0]}</p>}
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="font-medium">2. Which visual style feels right?</legend>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {VISUAL_STYLES.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={style === option.value}
                    onClick={() => setStyle(option.value)}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-colors hover:bg-accent",
                      style === option.value && "border-primary ring-2 ring-primary/30",
                    )}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </button>
                ))}
              </div>
              {errors.style && <p className="text-sm text-destructive">{errors.style[0]}</p>}
            </fieldset>

            <fieldset className="grid gap-4 md:grid-cols-2">
              <legend className="mb-3 font-medium">3. Anything else? (optional)</legend>
              <div className="space-y-2">
                <Label htmlFor="avoid">Colors or styles to avoid</Label>
                <Textarea
                  id="avoid"
                  name="avoid"
                  rows={2}
                  value={avoid}
                  onChange={(e) => setAvoid(e.target.value)}
                  placeholder="e.g. no pink, nothing that looks corporate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inspiration">Brands you admire</Label>
                <Textarea
                  id="inspiration"
                  name="inspiration"
                  rows={2}
                  value={inspiration}
                  onChange={(e) => setInspiration(e.target.value)}
                  placeholder="e.g. Duolingo, Notion, Glossier"
                />
              </div>
            </fieldset>
            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : state?.directions ? (
                <RefreshCw className="size-4" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {pending ? "Designing…" : state?.directions ? "Try three new directions" : "Show me three directions"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {state?.directions && (
        <div className="grid gap-4 lg:grid-cols-3">
          {state.directions.map((direction, index) => (
            <DirectionCard key={`${direction.name}-${index}`} direction={direction} projectName={projectName} />
          ))}
        </div>
      )}
    </div>
  )
}

function DirectionCard({ direction, projectName }: { direction: BrandDirection; projectName: string }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string>()

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>{direction.name}</CardTitle>
        <CardDescription>{direction.summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Swatches colors={direction.colors} />
        <BrandPreview brand={direction} projectName={projectName} compact />
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Fonts:</span> {direction.heading_font} / {direction.body_font}
          </p>
          <p>
            <span className="text-muted-foreground">Voice:</span> {direction.voice_traits.join(", ")}
          </p>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          className="w-full"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await chooseDirectionAction(direction)
              if (result?.error) setError(result.error)
            })
          }
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          Use this direction
        </Button>
      </CardFooter>
    </Card>
  )
}
