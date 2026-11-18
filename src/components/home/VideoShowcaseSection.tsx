import { getShowcaseConfig, resolveShowcaseVideos, type ShowcaseConfig, type ResolvedVideo } from '@/lib/video-showcase'

export default async function VideoShowcaseSection() {
  let config: ShowcaseConfig | null = null
  let videos: ResolvedVideo[] = []
  try {
    config = (await getShowcaseConfig()).config
    if (config.enabled && config.videos.length) {
      videos = (await resolveShowcaseVideos(config.videos)).filter((video) => video.status === 'READY' && video.url)
    }
  } catch {
    // Shopify configuration errors are shown in the protected admin page.
    // The optional section must not interrupt the public home page.
  }
  if (!config?.enabled || !videos.length) return null
  return (
      <section aria-labelledby="video-showcase-title" className="overflow-hidden bg-[#FAF8F5] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7 max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#8A641E]">Bakya in motion</p>
            <h2 id="video-showcase-title" className="font-playfair text-3xl font-semibold text-[#230532] md:text-4xl">{config.title}</h2>
            {config.subtitle && <p className="mt-3 text-sm leading-7 text-[#5B5146]">{config.subtitle}</p>}
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 sm:mx-0 sm:px-0">
            {videos.map((video) => (
              <figure key={video.id} className="w-[68vw] max-w-[280px] flex-none snap-start sm:w-[240px] lg:w-[260px]">
                <div className="aspect-[9/16] overflow-hidden rounded-2xl bg-[#230532] shadow-lg">
                  <video
                    className="h-full w-full object-cover"
                    src={video.url!}
                    poster={video.poster ?? undefined}
                    controls
                    playsInline
                    preload="none"
                    aria-label={video.title}
                  />
                </div>
                <figcaption className="mt-3 line-clamp-2 text-sm font-medium text-[#230532]">{video.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
  )
}
