import { getShowcaseConfig, resolveShowcaseVideos } from '@/lib/video-showcase'
import type { VideoConfig, ResolvedLibraryVideo } from '@/types/video-showcase'
import ShowcasePlayer from './ShowcasePlayer'

export default async function VideoShowcaseSection() {
  let config: VideoConfig | null = null
  let library: ResolvedLibraryVideo[] = []
  try {
    config = (await getShowcaseConfig()).config
    if (config.sections.some(s => s.enabled)) library = await resolveShowcaseVideos(config.library)
  } catch { return null }
  const sections = config.sections.filter(s => s.enabled && s.videoIds.some(id => library.some(v => v.id === id && v.status === 'READY' && v.url)))
  if (!sections.length) return null
  return <div className="flex flex-col gap-8 bg-[#FAF8F5] py-12 md:gap-10 md:py-16">{sections.map(section => {
    const videos = section.videoIds.map(id => library.find(v => v.id === id)).filter((v): v is ResolvedLibraryVideo => !!v && v.status === 'READY' && !!v.url)
    if (!videos.length) return null
    const player = (v: ResolvedLibraryVideo, portrait = false) => <ShowcasePlayer video={v} portrait={portrait} />
    let content
    if (section.layout === 'single-highlight') content = <div className="space-y-4">{player(videos[0]!)}<div className="grid grid-cols-2 gap-4 md:grid-cols-4">{videos.slice(1).map((v, i) => <div key={i}>{player(v)}</div>)}</div></div>
    else if (section.layout === 'spotlight') content = <div className="grid items-start gap-4 lg:grid-cols-3"><div className="lg:col-span-2">{player(videos[0]!)}</div><div className="grid grid-cols-2 gap-4 lg:grid-cols-1">{videos.slice(1).map((v, i) => <div key={i}>{player(v)}</div>)}</div></div>
    else if (section.layout === 'grid') content = <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">{videos.map((v, i) => <div key={i}>{player(v, v.orientation === 'reels')}</div>)}</div>
    else content = <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{videos.map((v, i) => <div key={i} className={`shrink-0 snap-start ${section.layout === 'reels' ? 'w-[240px] md:w-[280px]' : 'w-[85vw] max-w-[480px]'}`}>{player(v, section.layout === 'reels')}</div>)}</div>
    return <section key={section.id} style={{ marginTop: section.marginTop, marginBottom: section.marginBottom }} className="overflow-hidden" aria-labelledby={`video-${section.id}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id={`video-${section.id}`} className="font-playfair text-3xl text-[#230532] md:text-4xl">{section.title}</h2>
        {section.subtitle && <p className="mt-3 text-sm leading-7 text-stone-600">{section.subtitle}</p>}
        <div className="mt-7">{content}</div>
      </div>
    </section>
  })}</div>
}
