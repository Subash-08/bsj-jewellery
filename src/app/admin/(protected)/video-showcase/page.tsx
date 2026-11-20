'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowDown, ArrowUp, Plus, Trash2, Film } from 'lucide-react'
import { layouts, type VideoConfig, type VideoSection, type LibraryVideo, type ResolvedLibraryVideo } from '@/types/video-showcase'

const labels: Record<string, string> = {
  'single-highlight': 'Hero Highlight — Large video with thumbnails below',
  grid: 'Equal Grid — Responsive three columns',
  carousel: 'Horizontal Slider — Scrollable row',
  reels: 'Vertical Reels — Tall 9:16 players',
  spotlight: 'Spotlight Split — Large video with side videos',
}
const blank: VideoConfig = { version: 2, library: [], sections: [] }
const input = 'mt-1 w-full rounded border border-stone-300 bg-white p-2 text-sm'
const button = 'rounded bg-[#230532] px-4 py-2 text-sm text-white disabled:opacity-50'

export default function AdminVideoShowcasePage() {
  const [config, setConfig] = useState<VideoConfig>(blank)
  const [resolved, setResolved] = useState<ResolvedLibraryVideo[]>([])
  const [digest, setDigest] = useState<string | null>(null)
  const [tab, setTab] = useState<'sections' | 'library'>('sections')
  const [section, setSection] = useState<VideoSection | null>(null)
  const [picker, setPicker] = useState(false)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [orientation, setOrientation] = useState<LibraryVideo['orientation']>('reels')
  const [editing, setEditing] = useState<string | null>(null)
  const [pendingUpload, setPendingUpload] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/video-showcase', { cache: 'no-store' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not load videos')
      setConfig(data.config); setResolved(data.videos); setDigest(data.compareDigest); setLoaded(true)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not load videos') }
  }, [])
  useEffect(() => { void load() }, [load])

  async function persist(next: VideoConfig) {
    const response = await fetch('/api/admin/video-showcase', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ config: next, compareDigest: digest }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Could not save changes')
    setConfig(next)
    await load()
  }
  async function commit(next: VideoConfig) {
    setBusy(true); setMessage('')
    try { await persist(next); setMessage('Changes saved.'); return true }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save'); return false }
    finally { setBusy(false) }
  }
  async function uploadFile(selected: File, kind: 'video' | 'thumbnail') {
    const limit = kind === 'video' ? 25 : 2
    if (selected.size > limit * 1024 * 1024) throw new Error(`File must be smaller than ${limit} MB`)
    const response = await fetch('/api/admin/video-showcase/upload', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'stage', kind, filename: selected.name, mimeType: selected.type, size: selected.size }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Could not start upload')
    const form = new FormData()
    data.target.parameters.forEach((p: { name: string; value: string }) => form.append(p.name, p.value))
    form.append('file', selected)
    const transfer = await fetch(data.target.url, { method: 'POST', body: form })
    if (!transfer.ok) throw new Error('File transfer failed. Try uploading again.')
    const finish = await fetch('/api/admin/video-showcase/upload', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'finalize', kind, title: title.trim(), resourceUrl: data.target.resourceUrl }),
    })
    const result = await finish.json()
    if (!finish.ok) throw new Error(result.error || 'Could not create Shopify file')
    return result.video.id as string
  }
  async function submitVideo(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true); setMessage('')
    try {
      if (!editing && !file) throw new Error('Choose a video file')
      const id = editing || pendingUpload || await uploadFile(file!, 'video')
      if (!editing) setPendingUpload(id)
      const thumbnailId = thumbnail ? await uploadFile(thumbnail, 'thumbnail') : config.library.find(v => v.id === id)?.thumbnailId
      const video: LibraryVideo = { id, title: title.trim(), description, orientation, thumbnail: '', thumbnailId,
        createdAt: config.library.find(v => v.id === id)?.createdAt || new Date().toISOString() }
      await persist({ ...config, library: editing ? config.library.map(v => v.id === id ? video : v) : [...config.library, video] })
      setEditing(null); setPendingUpload(null); setFile(null); setThumbnail(null); setTitle(''); setDescription('')
      const form = event.target as HTMLFormElement
      form.reset()
      setMessage('Video saved. Shopify may take a few minutes to process new files. Refresh status to check.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Video save failed') }
    finally { setBusy(false) }
  }
  function newSection() {
    setPicker(false); setSearch('')
    setSection({ id: crypto.randomUUID(), title: '', subtitle: '', enabled: true, layout: 'reels', marginTop: 0, marginBottom: 0, videoIds: [] })
  }
  function reorder<T>(items: T[], index: number, offset: number) {
    const result = [...items], other = index + offset
    if (result[index] !== undefined && result[other] !== undefined) {
      const current = result[index]!
      result[index] = result[other]!
      result[other] = current
    }
    return result
  }
  const visible = config.library.filter(v => v.title.toLowerCase().includes(search.toLowerCase()))
  return <div className="max-w-6xl space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="font-serif text-2xl font-bold text-[#230532]">{tab === 'sections' ? 'Video Sections' : 'Video Library'}</h1>
        <p className="mt-2 text-sm text-stone-600">{tab === 'sections' ? 'Build and reorder video blocks for the home page.' : 'Upload once and reuse videos across sections.'}</p></div>
      <button disabled={busy} onClick={() => void load()} className="text-sm underline">Refresh status</button>
    </div>
    <div className="flex gap-2 border-b pb-3">
      <button onClick={() => { setTab('sections'); setSection(null) }} className={tab === 'sections' ? button : 'px-4 py-2 text-sm'}>Video sections</button>
      <button onClick={() => { setTab('library'); setSection(null) }} className={tab === 'library' ? button : 'px-4 py-2 text-sm'}>Video library ({config.library.length})</button>
    </div>
    {message && <p role="status" className="rounded border border-amber-200 bg-amber-50 p-4 text-sm">{message}</p>}
    {!loaded ? <p>Loading Shopify videos…</p> : tab === 'library' ? <>
      <form onSubmit={submitVideo} className="space-y-4 rounded-xl border bg-white p-5">
        <h2 className="font-serif text-xl">{editing ? 'Edit video' : 'Upload new video'}</h2>
        <p className="text-xs leading-6 text-stone-500">Recommended: landscape 1280×720, reels 1080×1920, YouTube style 1920×1080. Use 30 fps; 4K is unnecessary. Video limit 25 MB (20 MB recommended for reels).</p>
        {!editing && <label className="block text-sm">Video file (MP4 / MOV / WebM, max 25 MB) *
          <input type="file" required accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm" onChange={e => { setFile(e.target.files?.[0] || null); setPendingUpload(null) }} className={input} /></label>}
        <label className="block text-sm">Title *<input required maxLength={100} value={title} onChange={e => setTitle(e.target.value)} className={input} /></label>
        <label className="block text-sm">Custom thumbnail (optional, JPEG / PNG / WebP, max 2 MB)
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setThumbnail(e.target.files?.[0] || null)} className={input} /></label>
        <p className="text-xs text-stone-500">Without a custom thumbnail, Shopify generates a preview frame.</p>
        <label className="block text-sm">Description<textarea maxLength={1000} value={description} onChange={e => setDescription(e.target.value)} className={input} /></label>
        <label className="block text-sm">Display orientation<select value={orientation} onChange={e => setOrientation(e.target.value as LibraryVideo['orientation'])} className={input}>
          <option value="landscape">Landscape (16:9)</option><option value="reels">Reels (9:16)</option><option value="youtube">YouTube style (16:9)</option>
        </select></label>
        <div className="flex gap-3"><button disabled={busy || !title.trim()} className={button}>{busy ? 'Saving…' : editing ? 'Save video' : 'Upload video'}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setTitle(''); setDescription(''); setThumbnail(null) }}>Cancel</button>}</div>
      </form>
      <input aria-label="Search videos" placeholder="Search videos by title…" value={search} onChange={e => setSearch(e.target.value)} className={input} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visible.map(video => {
        const live = resolved.find(v => v.id === video.id)
        const usage = config.sections.reduce((n, s) => n + s.videoIds.filter(id => id === video.id).length, 0)
        return <article key={video.id} className="rounded-xl border bg-white p-4">
          {live?.poster ? <Image src={live.poster} alt="" width={400} height={225} className="aspect-video w-full rounded object-contain bg-stone-100" /> : <div className="flex aspect-video items-center justify-center bg-stone-100"><Film /></div>}
          <h2 className="mt-3 font-semibold">{video.title}</h2><p className="mt-1 text-xs text-stone-500">{video.orientation.toUpperCase()} · {live?.status || 'Processing'} · {usage} placements</p>
          {video.createdAt && <p className="mt-1 text-xs text-stone-500">{new Date(video.createdAt).toLocaleDateString('en-IN')}</p>}
          <div className="mt-4 flex gap-4 text-sm">
            <button disabled={busy} onClick={() => { setEditing(video.id); setTitle(video.title); setDescription(video.description); setOrientation(video.orientation); setThumbnail(null) }} className="underline">Edit</button>
            <button disabled={busy} className="text-red-700" onClick={() => { if (window.confirm('Remove this video from the library and all sections? The Shopify file will be retained.')) void commit({ ...config, library: config.library.filter(v => v.id !== video.id), sections: config.sections.map(s => ({ ...s, videoIds: s.videoIds.filter(id => id !== video.id) })) }) }}>Remove</button>
          </div>
        </article>
      })}</div>
    </> : section ? <form className="space-y-5 rounded-xl border bg-white p-5" onSubmit={async e => {
      e.preventDefault()
      const sections = config.sections.some(s => s.id === section.id) ? config.sections.map(s => s.id === section.id ? section : s) : [...config.sections, section]
      if (await commit({ ...config, sections })) setSection(null)
    }}>
      <h2 className="font-serif text-xl">Section details</h2>
      <label className="block text-sm">Main title *<input required maxLength={100} value={section.title} onChange={e => setSection({ ...section, title: e.target.value })} className={input} /></label>
      <label className="block text-sm">Subtitle<input maxLength={250} value={section.subtitle} onChange={e => setSection({ ...section, subtitle: e.target.value })} className={input} /></label>
      <div className="grid grid-cols-2 gap-4">{(['marginTop', 'marginBottom'] as const).map(key => <label key={key} className="text-sm">{key === 'marginTop' ? 'Top margin (px)' : 'Bottom margin (px)'}<input type="number" min={0} max={240} value={section[key]} onChange={e => setSection({ ...section, [key]: Number(e.target.value) })} className={input} /></label>)}</div>
      <label className="flex gap-2 text-sm"><input type="checkbox" checked={section.enabled} onChange={e => setSection({ ...section, enabled: e.target.checked })} /> Show on home page</label>
      <fieldset><legend className="mb-3 font-semibold">Presentation layout</legend><div className="grid gap-3 sm:grid-cols-2">{layouts.map(layout => <label key={layout} className="flex gap-2 rounded border p-3 text-sm"><input type="radio" name="layout" checked={section.layout === layout} onChange={() => setSection({ ...section, layout })} />{labels[layout]}</label>)}</div></fieldset>
      <div className="flex items-center justify-between"><h3 className="font-semibold">Assigned videos ({section.videoIds.length}/24)</h3><button type="button" onClick={() => setPicker(!picker)} className={button}>Attach videos</button></div>
      {picker && <div className="rounded border bg-stone-50 p-4">
        <input aria-label="Search library" placeholder="Search videos…" value={search} onChange={e => setSearch(e.target.value)} className={input} />
        <p className="my-2 text-xs text-stone-500">Click Add again to repeat a video in this section.</p>
        {visible.map(video => <div key={video.id} className="flex items-center justify-between gap-3 border-b py-2 text-sm"><span>{video.title}</span><button type="button" disabled={section.videoIds.length >= 24} onClick={() => setSection({ ...section, videoIds: [...section.videoIds, video.id] })} className="underline disabled:opacity-40">Add</button></div>)}
        {!visible.length && <p className="text-sm">Upload videos in the Video Library first.</p>}
      </div>}
      {!section.videoIds.length && <p className="text-sm text-stone-500">No videos attached yet. Empty sections are hidden on the home page.</p>}
      {section.videoIds.map((id, index) => <div key={index} className="flex items-center gap-3 rounded border p-3 text-sm"><span className="flex-1">{config.library.find(v => v.id === id)?.title}</span>
        <button type="button" aria-label="Move video up" disabled={index === 0} onClick={() => setSection({ ...section, videoIds: reorder(section.videoIds, index, -1) })}><ArrowUp size={17} /></button>
        <button type="button" aria-label="Move video down" disabled={index === section.videoIds.length - 1} onClick={() => setSection({ ...section, videoIds: reorder(section.videoIds, index, 1) })}><ArrowDown size={17} /></button>
        <button type="button" aria-label="Remove placement" onClick={() => setSection({ ...section, videoIds: section.videoIds.filter((_, i) => i !== index) })}><Trash2 size={17} /></button>
      </div>)}
      <div className="flex gap-4"><button disabled={busy} className={button}>Save section</button><button type="button" onClick={() => { setSection(null); setPicker(false) }}>Cancel</button></div>
    </form> : <>
      <button disabled={busy || config.sections.length >= 20} onClick={newSection} className={button}><Plus size={16} className="mr-2 inline" />Add section</button>
      {config.sections.length === 0 && <p className="text-sm text-stone-500">Create your first video section, then attach videos from the library.</p>}
      {config.sections.map((s, index) => <article key={s.id} className="flex flex-wrap items-center gap-4 rounded-xl border bg-white p-5">
        <div className="min-w-0 flex-1"><h2 className="font-serif text-xl">{s.title}</h2><p className="mt-1 text-sm text-stone-500">{s.layout} · {s.videoIds.length} videos · {s.enabled ? 'Visible' : 'Hidden'}</p><p className="mt-1 text-sm">{s.subtitle || 'No subtitle'}</p></div>
        <button disabled={busy || index === 0} aria-label="Move section up" onClick={() => void commit({ ...config, sections: reorder(config.sections, index, -1) })}><ArrowUp size={18} /></button>
        <button disabled={busy || index === config.sections.length - 1} aria-label="Move section down" onClick={() => void commit({ ...config, sections: reorder(config.sections, index, 1) })}><ArrowDown size={18} /></button>
        <button disabled={busy} onClick={() => { setSection(s); setPicker(false); setSearch('') }} className="text-sm underline">Edit</button>
        <button disabled={busy} aria-label="Delete section" onClick={() => { if (window.confirm('Delete this section? Its videos remain in the library.')) void commit({ ...config, sections: config.sections.filter(v => v.id !== s.id) }) }} className="text-red-700"><Trash2 size={18} /></button>
      </article>)}
    </>}
  </div>
}
