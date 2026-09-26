import { useRef, useState } from 'react'

const CLOUDINARY_CLOUD_NAME = 'td7em3xq'
const CLOUDINARY_UPLOAD_PRESET = 'ch_proyectos'

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

async function uploadToCloudinary(file, folder = 'proyectos') {
  if (!ALLOWED.includes(file.type)) throw new Error('Formato no permitido (JPG, PNG, WEBP o GIF)')
  if (file.size > MAX_SIZE) throw new Error('La imagen no puede superar los 5 MB')

  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  fd.append('folder', folder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: fd }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Error al subir imagen')
  // Insertar transformaciones: formato automático (WebP/AVIF), calidad optimizada, ancho máximo
  return data.secure_url.replace('/upload/', '/upload/f_auto,q_auto:good,w_1400/')
}

/** Single image — drag & drop o clic → Cloudinary → devuelve URL */
export function ImageUploader({ value, onChange, label, hint, previewHeight = 'h-36', folder = 'proyectos' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  async function upload(file) {
    setUploading(true)
    setError('')
    try {
      const url = await uploadToCloudinary(file, folder)
      onChange(url)
    } catch (e) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {label && <label className="mb-1.5 block text-xs text-slate-400">{label}</label>}

      <div
        className={`group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-700 transition hover:border-amber-400 ${previewHeight} ${uploading ? 'pointer-events-none' : ''}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) upload(f) }}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            {value && <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
            <Spinner />
            <span className="text-xs relative z-10">Subiendo…</span>
          </div>
        ) : value ? (
          <>
            <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/50 opacity-0 transition group-hover:opacity-100">
              <UploadIcon />
              <span className="text-xs text-white">Cambiar imagen</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center text-slate-500">
            <ImageIcon />
            <span className="text-xs leading-relaxed">
              {hint || 'Clic o arrastrá una imagen (JPG, PNG, WEBP · máx 5 MB)'}
            </span>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-400"
        >
          <XIcon /> Quitar imagen
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = '' }}
      />
    </div>
  )
}

/** Multi-image — thumbnails con botón de eliminar */
export function MultiImageUploader({ value, onChange, label, max = 8, folder = 'proyectos' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  async function upload(files) {
    setUploading(true)
    setError('')
    const uploaded = []
    try {
      for (const file of Array.from(files)) {
        const url = await uploadToCloudinary(file, folder)
        uploaded.push(url)
      }
      onChange([...value, ...uploaded].slice(0, max))
    } catch (e) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  const remove = (url) => onChange(value.filter((u) => u !== url))

  return (
    <div>
      {label && <label className="mb-1.5 block text-xs text-slate-400">{label}</label>}

      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {value.map((url) => (
            <div key={url} className="group relative h-16 w-16 overflow-hidden rounded-md border border-slate-700">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100"
              >
                <XIcon className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {value.length < max && (
        <div
          className={`flex h-20 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-700 transition hover:border-amber-400 ${uploading ? 'pointer-events-none opacity-60' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) upload(e.dataTransfer.files) }}
        >
          {uploading ? <Spinner /> : (
            <>
              <UploadIcon />
              <span className="text-xs text-slate-500">Agregar fotos ({value.length}/{max})</span>
            </>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) upload(e.target.files); e.target.value = '' }}
      />
    </div>
  )
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V4a10 10 0 00-10 10h2z" />
    </svg>
  )
}
function UploadIcon() {
  return (
    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  )
}
function ImageIcon() {
  return (
    <svg className="h-8 w-8 opacity-40 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V6.75A2.25 2.25 0 0020.25 4.5H3.75A2.25 2.25 0 001.5 6.75v12A2.25 2.25 0 003.75 21z" />
    </svg>
  )
}
function XIcon({ className = '' }) {
  return (
    <svg className={`h-4 w-4 ${className}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
