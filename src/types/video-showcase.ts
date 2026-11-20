import { z } from 'zod'

export const videoSchema = z.object({
  id: z.string().regex(/^gid:\/\/shopify\/Video\/\d+$/),
  title: z.string().trim().min(1).max(100),
  description: z.string().max(1000).default(''),
  orientation: z.enum(['landscape', 'reels', 'youtube']).default('reels'),
  thumbnail: z.string().max(2000).refine(v => !v || /^https:\/\/cdn\.shopify\.com\//.test(v), 'Use a Shopify image URL').default(''),
  createdAt: z.string().default(''),
  thumbnailId: z.string().regex(/^gid:\/\/shopify\/MediaImage\/\d+$/).optional(),
})
export const layouts = ['single-highlight', 'grid', 'carousel', 'reels', 'spotlight'] as const
export const sectionSchema = z.object({
  id: z.string().min(1).max(100),
  title: z.string().trim().min(1).max(100),
  subtitle: z.string().max(250),
  enabled: z.boolean(),
  layout: z.enum(layouts),
  marginTop: z.number().int().min(0).max(240),
  marginBottom: z.number().int().min(0).max(240),
  videoIds: z.array(z.string()).max(24),
})
export const videoConfigSchema = z.object({
  version: z.literal(2),
  library: z.array(videoSchema).max(100),
  sections: z.array(sectionSchema).max(20),
}).superRefine((value, ctx) => {
  const ids = value.library.map(v => v.id)
  if (new Set(ids).size !== ids.length || new Set(value.sections.map(s => s.id)).size !== value.sections.length)
    ctx.addIssue({ code: 'custom', message: 'Library and section IDs must be unique' })
  if (value.sections.some(s => s.videoIds.some(id => !ids.includes(id))))
    ctx.addIssue({ code: 'custom', message: 'A section references a video outside the library' })
})
export type LibraryVideo = z.infer<typeof videoSchema>
export type VideoSection = z.infer<typeof sectionSchema>
export type VideoConfig = z.infer<typeof videoConfigSchema>
export type ResolvedLibraryVideo = LibraryVideo & { status: string; url: string | null; poster: string | null; duration: number | null }
