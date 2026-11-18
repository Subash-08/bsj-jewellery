'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Film, Loader2, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import type { ShowcaseConfig, ResolvedVideo } from '@/lib/video-showcase'

const initial: ShowcaseConfig = {
  enabled: false,
  title: 'Stories in Silver',
  subtitle: 'A closer look at the pieces and people behind Bakya.',
  videos: [],
}

export default function AdminVideoShowcasePage() {
  const [config, setConfig] = useState<ShowcaseConfig>(initial)
  const [resolved, setResolved] = useState<ResolvedVideo[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [videoTitle, setVideoTitle] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/video-showcase', { cache: 'no-store' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not load showcase')
      setConfig(data.config)
      setResolved(data.videos)
      setMessage('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load showcase')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  async function upload() {
    if (!file || !videoTitle.trim()) return setMessage('Choose a video and enter its title.')
    if (config.videos.length >= 12) return setMessage('The showcase supports up to 12 videos.')
    setBusy(true)
    setMessage('')
    try {
      const stage = await fetch('/api/admin/video-showcase/upload', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stage', filename: file.name, mimeType: file.type, size: file.size }),
      })
      const stageData = await stage.json()
      if (!stage.ok) throw new Error(stageData.error || 'Could not start upload')
      const target = stageData.target as { url: string; resourceUrl: string; parameters: { name: string; value: string }[] }
      const form = new FormData()
      target.parameters.forEach(({ name, value }) => form.append(name, value))
      form.append('file', file)
      const transfer = await fetch(target.url, { method: 'POST', body: form })
      if (!transfer.ok) throw new Error(`Video transfer failed (${transfer.status})`)
      const finish = await fetch('/api/admin/video-showcase/upload', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'finalize', resourceUrl: target.resourceUrl, title: videoTitle.trim() }),
      })
      const finishData = await finish.json()
      if (!finish.ok) throw new Error(finishData.error || 'Could not create Shopify file')
      const next = { ...config, videos: [...config.videos, { id: finishData.video.id, title: videoTitle.trim() }] }
      await save(next)
      setFile(null)
      setVideoTitle('')
      const input = document.getElementById('showcase-file') as HTMLInputElement | null
      if (input) input.value = ''
      setMessage('Uploaded to Shopify. Processing may take a few minutes; refresh status before publishing.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  async function save(next: ShowcaseConfig = config) {
    setBusy(true)
    try {
      const response = await fetch('/api/admin/video-showcase', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not save')
      setConfig(next)
      setMessage('Showcase saved.')
      await load()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save')
    } finally {
      setBusy(false)
    }
  }

  function move(index: number, offset: number) {
    const videos = [...config.videos]
    const nextIndex = index + offset
    if (nextIndex < 0 || nextIndex >= videos.length) return
    const current = videos[index]
    const neighbor = videos[nextIndex]
    if (!current || !neighbor) return
    videos[index] = neighbor
    videos[nextIndex] = current
    setConfig({ ...config, videos })
  }

  return (
    <div className="max-w-4xl space-y-7">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#230532]">Home Video Showcase</h1>
        <p className="mt-2 text-sm text-stone-600">Upload MP4 or MOV videos to Shopify Files, then choose which ones appear on the home page.</p>
      </div>
      {message && <p role="status" className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-stone-800">{message}</p>}
      {message.includes('401') && (
        <div className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-stone-800">
          <p className="font-semibold">Shopify app authentication needs attention.</p>
          <p className="mt-1">Use the canonical shop domain and configure valid server-side app credentials in local and Vercel settings. See <a className="underline" href="https://help.shopify.com/en/manual/apps/install-setup-apps" target="_blank" rel="noopener noreferrer">Shopify custom app setup</a>.</p>
        </div>
      )}
      {loading ? <p className="flex items-center gap-2 text-sm text-stone-600"><Loader2 className="h-4 w-4 animate-spin" /> Loading Shopify videos...</p> : (
        <>
          <div className="space-y-4 rounded-lg border border-stone-200 bg-white p-5">
            <label className="flex items-center gap-3 text-sm font-medium text-[#230532]">
              <input type="checkbox" checked={config.enabled} onChange={(event) => setConfig({ ...config, enabled: event.target.checked })} />
              Show this section on the home page
            </label>
            <label className="block text-sm font-medium text-stone-700">Section heading
              <input maxLength={100} value={config.title} onChange={(event) => setConfig({ ...config, title: event.target.value })} className="mt-1 w-full rounded border border-stone-300 p-2" />
            </label>
            <label className="block text-sm font-medium text-stone-700">Short description
              <textarea maxLength={250} rows={2} value={config.subtitle} onChange={(event) => setConfig({ ...config, subtitle: event.target.value })} className="mt-1 w-full rounded border border-stone-300 p-2" />
            </label>
            <button disabled={busy} onClick={() => void save()} className="rounded bg-[#230532] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">Save section</button>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-5">
            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-[#230532]"><Upload size={18} /> Add a video</h2>
            <p className="mt-1 text-xs text-stone-500">MP4 or MOV, up to 100 MB. Your browser sends the file directly to Shopify; processing can take a few minutes.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <input id="showcase-file" type="file" accept=".mp4,.mov,video/mp4,video/quicktime" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="min-w-0 rounded border border-stone-300 p-2 text-sm" />
              <input value={videoTitle} onChange={(event) => setVideoTitle(event.target.value)} maxLength={100} placeholder="Video title" aria-label="Video title" className="min-w-0 rounded border border-stone-300 p-2 text-sm" />
              <button disabled={busy || !file || !videoTitle.trim()} onClick={() => void upload()} className="rounded bg-[#230532] px-4 py-2 text-sm text-white disabled:opacity-50">{busy ? 'Working...' : 'Upload'}</button>
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-[#230532]"><Film size={18} /> Showcase videos ({config.videos.length}/12)</h2>
              <button onClick={() => void load()} className="text-sm text-[#230532] underline">Refresh status</button>
            </div>
            {config.videos.length === 0 ? <p className="mt-5 text-sm text-stone-500">No videos yet. The home page section stays hidden until videos are ready and the section is enabled.</p> : (
              <ul className="mt-4 space-y-3">
                {config.videos.map((video, index) => {
                  const live = resolved.find((item) => item.id === video.id)
                  return (
                    <li key={video.id} className="flex items-center gap-3 rounded border border-stone-200 p-3">
                      {live?.poster ? <Image src={live.poster} alt="" width={48} height={64} className="h-16 w-12 rounded object-cover" /> : <div className="flex h-16 w-12 items-center justify-center rounded bg-stone-100"><Film size={16} /></div>}
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{video.title}</p><p className="text-xs text-stone-500">{live?.status ?? 'Processing'}</p></div>
                      <button onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${video.title} up`} className="disabled:opacity-30"><ArrowUp size={16} /></button>
                      <button onClick={() => move(index, 1)} disabled={index === config.videos.length - 1} aria-label={`Move ${video.title} down`} className="disabled:opacity-30"><ArrowDown size={16} /></button>
                      <button onClick={() => setConfig({ ...config, videos: config.videos.filter((item) => item.id !== video.id) })} aria-label={`Remove ${video.title}`} className="text-red-700"><Trash2 size={16} /></button>
                    </li>
                  )
                })}
              </ul>
            )}
            <p className="mt-3 text-xs text-stone-500">Save after changing the order or removing a video. Removing it here does not delete the file from Shopify.</p>
          </div>
        </>
      )}
    </div>
  )
}
