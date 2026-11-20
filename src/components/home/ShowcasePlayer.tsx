'use client'
import { useState } from 'react'
import type { ResolvedLibraryVideo } from '@/types/video-showcase'

export default function ShowcasePlayer({ video, portrait = false }: { video: ResolvedLibraryVideo; portrait?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const seconds = Math.round((video.duration ?? 0) / 1000)
  const duration = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
  return <div className={`relative overflow-hidden rounded-2xl bg-black shadow-md ${portrait ? 'aspect-[9/16]' : 'aspect-video'}`}>
    <video src={video.url!} poster={video.poster || undefined} controls playsInline preload="metadata"
      onPlay={event => { setPlaying(true); document.querySelectorAll('video').forEach(v => { if (v !== event.currentTarget) v.pause() }) }}
      onPause={() => setPlaying(false)}
      aria-label={video.title} className="h-full w-full object-contain" />
    {!playing && seconds > 0 && <span className="pointer-events-none absolute right-3 top-3 rounded bg-black/75 px-2 py-1 text-xs tabular-nums text-white">{duration}</span>}
  </div>
}
