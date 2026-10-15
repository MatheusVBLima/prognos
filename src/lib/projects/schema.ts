import { z } from "zod"

export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "pt", label: "Portuguese" },
  { value: "es", label: "Spanish" },
] as const

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || null)

export const projectFormSchema = z.object({
  name: z.string().trim().min(1, "Give your project a name").max(100),
  websiteUrl: z
    .string()
    .trim()
    .transform((value) => (value && !/^https?:\/\//i.test(value) ? `https://${value}` : value))
    .pipe(z.union([z.literal(""), z.url({ protocol: /^https?$/, message: "Enter a valid URL" })]))
    .transform((value) => value || null),
  description: z.string().trim().min(10, "Describe your project in at least a sentence").max(2000),
  niche: optionalText(200),
  audience: optionalText(500),
  goals: optionalText(500),
  language: z.enum(LANGUAGES.map((l) => l.value) as [string, ...string[]]),
  country: optionalText(100),
})

export type ProjectFormValues = z.input<typeof projectFormSchema>
