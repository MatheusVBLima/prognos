"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Globe, Loader2, Plus, RotateCcw, Sparkles, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BrandFonts, BrandPreview } from "@/components/brand/BrandPreview"
import { resetBrandKitAction, saveBrandKitAction } from "@/app/dashboard/brand/actions"
import { FONTS, fontStack } from "@/lib/brand/fonts"
import { COLOR_ROLES, type BrandKitFormValues } from "@/lib/brand/schema"
import type { BrandKit } from "@/lib/brand/queries"

const SOURCE_LABELS: Record<string, { label: string; icon: typeof Globe }> = {
  website: { label: "Imported from your website", icon: Globe },
  generated: { label: "Designed with AI", icon: Sparkles },
}

const FONT_GROUPS = [...new Set(FONTS.map((f) => f.category))]

function toForm(kit: BrandKit): BrandKitFormValues {
  return {
    colors: kit.colors,
    heading_font: kit.heading_font,
    body_font: kit.body_font,
    logo_url: kit.logo_url,
    tone_of_voice: kit.tone_of_voice,
    voice_traits: kit.voice_traits,
    keywords: kit.keywords,
    value_proposition: kit.value_proposition,
    audience_summary: kit.audience_summary,
  }
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

function TagInput({
  id,
  values,
  onChange,
  placeholder,
  max,
}: {
  id: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder: string
  max: number
}) {
  const [draft, setDraft] = useState("")
  const add = () => {
    const value = draft.trim().slice(0, 40)
    if (value && !values.includes(value) && values.length < max) onChange([...values, value])
    setDraft("")
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {values.map((value) => (
          <Badge key={value} variant="secondary" className="gap-1 py-1 pl-2.5 text-sm">
            {value}
            <button
              type="button"
              aria-label={`Remove ${value}`}
              className="rounded-full p-0.5 hover:bg-background"
              onClick={() => onChange(values.filter((v) => v !== value))}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        id={id}
        value={draft}
        disabled={values.length >= max}
        placeholder={values.length >= max ? `Up to ${max}` : placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={add}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            add()
          }
        }}
      />
    </div>
  )
}

function FontSelect({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="w-full" style={{ fontFamily: fontStack(value) }}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {FONT_GROUPS.map((group) => (
          <SelectGroup key={group}>
            <SelectLabel className="capitalize">{group}</SelectLabel>
            {FONTS.filter((f) => f.category === group).map((font) => (
              <SelectItem key={font.family} value={font.family} style={{ fontFamily: fontStack(font.family) }}>
                {font.family}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}

export function BrandEditor({ kit, projectName }: { kit: BrandKit; projectName: string }) {
  const [values, setValues] = useState(() => toForm(kit))
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({})
  const [saving, startSaving] = useTransition()
  const [resetting, startResetting] = useTransition()
  const [dirty, setDirty] = useState(false)

  const set = <K extends keyof BrandKitFormValues>(key: K, value: BrandKitFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    setDirty(true)
  }
  const setColor = (index: number, patch: Partial<BrandKitFormValues["colors"][number]>) =>
    set(
      "colors",
      values.colors.map((color, i) => (i === index ? { ...color, ...patch } : color)),
    )

  const save = () =>
    startSaving(async () => {
      const result = await saveBrandKitAction(values)
      setErrors(result.fieldErrors ?? {})
      if (result.ok) {
        setDirty(false)
        toast.success("Brand kit saved")
      } else {
        toast.error(result.error ?? "Couldn't save your brand kit")
      }
    })

  const source = SOURCE_LABELS[kit.source]
  const validHex = (hex: string) => /^#[0-9a-f]{6}$/i.test(hex)
  const previewColors = values.colors.filter((c) => validHex(c.hex))

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <BrandFonts families={FONTS.map((f) => f.family)} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Brand kit</h1>
          <p className="text-muted-foreground">The look and voice of everything created for {projectName}.</p>
          {source && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <source.icon className="size-3.5" />
              {source.label}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <RotateCcw className="size-4" />
                Start over
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start your brand over?</DialogTitle>
                <DialogDescription>
                  This clears the current kit so you can import it again or design a new one.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  disabled={resetting}
                  onClick={() => startResetting(() => resetBrandKitAction())}
                >
                  {resetting && <Loader2 className="size-4 animate-spin" />}
                  Start over
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={save} disabled={saving || !dirty}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            {dirty ? "Save changes" : "Saved"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Section title="Colors" description="Roles tell the designer where each color goes.">
            <div className="space-y-4 sm:space-y-3">
              {values.colors.map((color, index) => (
                <div key={index} className="grid grid-cols-[2.5rem_1fr_2.25rem] items-center gap-2 sm:flex">
                  <label
                    className="relative size-10 shrink-0 cursor-pointer overflow-hidden rounded-md border"
                    style={{ background: validHex(color.hex) ? color.hex : undefined }}
                  >
                    <span className="sr-only">Pick {color.name}</span>
                    <input
                      type="color"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      value={validHex(color.hex) ? color.hex : "#000000"}
                      onChange={(e) => setColor(index, { hex: e.target.value.toUpperCase() })}
                    />
                  </label>
                  <Input
                    aria-label="Hex"
                    className="font-mono uppercase sm:w-28"
                    value={color.hex}
                    maxLength={7}
                    onChange={(e) => {
                      const raw = e.target.value.trim()
                      setColor(index, { hex: raw.startsWith("#") ? raw : `#${raw}` })
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="sm:order-last"
                    aria-label={`Remove ${color.name}`}
                    disabled={values.colors.length <= 1}
                    onClick={() => set("colors", values.colors.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <div className="col-span-3 grid grid-cols-2 gap-2 sm:contents">
                    <Input
                      aria-label="Name"
                      className="sm:min-w-32 sm:flex-1"
                      value={color.name}
                      maxLength={40}
                      onChange={(e) => setColor(index, { name: e.target.value })}
                    />
                    <Select value={color.role} onValueChange={(role) => setColor(index, { role: role as typeof color.role })}>
                      <SelectTrigger aria-label="Role" className="w-full capitalize sm:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COLOR_ROLES.map((role) => (
                          <SelectItem key={role} value={role} className="capitalize">
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
            {errors.colors && <p className="text-sm text-destructive">{errors.colors[0]}</p>}
            {values.colors.some((c) => !validHex(c.hex)) && (
              <p className="text-sm text-destructive">Use 6-digit hex colors like #7C3AED.</p>
            )}
            <Button
              variant="outline"
              size="sm"
              disabled={values.colors.length >= 8}
              onClick={() => set("colors", [...values.colors, { name: "New color", hex: "#64748B", role: "accent" }])}
            >
              <Plus className="size-4" />
              Add color
            </Button>
          </Section>

          <Section title="Typography">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="heading_font">Headings</Label>
                <FontSelect id="heading_font" value={values.heading_font} onChange={(v) => set("heading_font", v)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body_font">Body text</Label>
                <FontSelect id="body_font" value={values.body_font} onChange={(v) => set("body_font", v)} />
              </div>
            </div>
          </Section>

          <Section title="Logo">
            <div className="flex items-center gap-3">
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                {values.logo_url ? (
                  <img src={values.logo_url} alt="Logo preview" className="size-full object-contain" />
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="logo_url">Logo image URL</Label>
                <Input
                  id="logo_url"
                  value={values.logo_url ?? ""}
                  placeholder="https://example.com/logo.png"
                  onChange={(e) => set("logo_url", e.target.value || null)}
                />
                {errors.logo_url && <p className="text-sm text-destructive">{errors.logo_url[0]}</p>}
              </div>
            </div>
          </Section>

          <Section title="Voice" description="How your content sounds. The AI follows this when it writes.">
            <div className="space-y-2">
              <Label htmlFor="tone_of_voice">Tone of voice</Label>
              <Textarea
                id="tone_of_voice"
                rows={3}
                value={values.tone_of_voice ?? ""}
                placeholder="e.g. Encouraging and direct, like a friend who aced the exam last year."
                onChange={(e) => set("tone_of_voice", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voice_traits">Personality traits</Label>
              <TagInput
                id="voice_traits"
                values={values.voice_traits}
                max={8}
                placeholder="Type a trait and press Enter"
                onChange={(v) => set("voice_traits", v)}
              />
            </div>
          </Section>

          <Section title="Positioning" description="What you stand for and who you talk to.">
            <div className="space-y-2">
              <Label htmlFor="value_proposition">Value proposition</Label>
              <Textarea
                id="value_proposition"
                rows={2}
                value={values.value_proposition ?? ""}
                onChange={(e) => set("value_proposition", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience_summary">Audience</Label>
              <Textarea
                id="audience_summary"
                rows={2}
                value={values.audience_summary ?? ""}
                onChange={(e) => set("audience_summary", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords and topics</Label>
              <TagInput
                id="keywords"
                values={values.keywords}
                max={15}
                placeholder="Type a topic and press Enter"
                onChange={(v) => set("keywords", v)}
              />
            </div>
          </Section>
        </div>

        <div className="lg:sticky lg:top-4 lg:self-start">
          <Card className="gap-4">
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
              <CardDescription>A sample post and reel cover with your kit.</CardDescription>
            </CardHeader>
            <CardContent>
              <BrandPreview
                brand={{ ...values, colors: previewColors }}
                projectName={projectName}
                headline={values.keywords[0] ? `What everyone gets wrong about ${values.keywords[0]}` : undefined}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
