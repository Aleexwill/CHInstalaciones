import { useState } from 'react'
import { useCarousel } from '../../hooks/useCarousel'
import { ImageUploader } from './ImageUploader'

const EMPTY = { image: '', title: '', subtitle: '', isActive: true, order: 0 }

export default function AdminCarousel() {
  const { slides, loading, createSlide, updateSlide, deleteSlide } = useCarousel()
  const [editing, setEditing] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)

  function openNew() {
    setIsNew(true)
    setEditing({ ...EMPTY, order: slides.length })
  }

  function openEdit(slide) {
    setIsNew(false)
    setEditing({ ...slide })
  }

  async function save() {
    if (!editing?.image) return
    setSaving(true)
    try {
      const { id, ...data } = editing
      if (isNew) await createSlide(data)
      else await updateSlide(id, data)
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  async function del(id) {
    if (!confirm('¿Eliminar esta imagen del carrusel?')) return
    await deleteSlide(id)
  }

  async function toggle(slide) {
    await updateSlide(slide.id, { isActive: !slide.isActive })
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Carrusel de inicio</h2>
          <p className="mt-0.5 text-sm text-slate-500">{slides.length} imágenes · se muestran en la portada</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
        >
          <PlusIcon /> Agregar imagen
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-slate-800 bg-slate-900 h-48" />
          ))}
        </div>
      ) : slides.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-16 text-center">
          <div className="text-4xl mb-4">🖼️</div>
          <h3 className="text-lg font-semibold text-white">Sin imágenes en el carrusel</h3>
          <p className="mt-2 text-sm text-slate-500">Agregá fotos de tus trabajos para mostrarlas en la portada.</p>
          <button
            onClick={openNew}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
          >
            <PlusIcon /> Agregar primera imagen
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slides.map((slide, i) => (
            <div key={slide.id} className="group relative rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
              <div className="relative h-44">
                {slide.image ? (
                  <img src={slide.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-800 text-slate-600">
                    <NoImageIcon />
                  </div>
                )}
                {/* Order badge */}
                <span className="absolute top-2 left-2 rounded bg-slate-950/70 px-2 py-0.5 text-xs text-slate-300">
                  #{i + 1}
                </span>
                {!slide.isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60">
                    <span className="rounded-full bg-red-500/80 px-3 py-1 text-xs text-white">Inactiva</span>
                  </div>
                )}
              </div>

              <div className="p-3">
                {slide.title && <p className="text-sm font-medium text-white line-clamp-1">{slide.title}</p>}
                {slide.subtitle && <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{slide.subtitle}</p>}

                <div className="mt-3 flex items-center gap-1 border-t border-slate-800 pt-3">
                  <button
                    onClick={() => toggle(slide)}
                    title={slide.isActive ? 'Desactivar' : 'Activar'}
                    className="rounded p-1.5 text-slate-600 hover:text-slate-300 transition-colors"
                  >
                    {slide.isActive ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                  <button
                    onClick={() => openEdit(slide)}
                    className="rounded p-1.5 text-slate-600 hover:text-amber-400 transition-colors"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => del(slide.id)}
                    className="ml-auto rounded p-1.5 text-slate-700 hover:text-red-400 transition-colors"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h3 className="font-semibold text-white">{isNew ? 'Agregar imagen' : 'Editar imagen'}</h3>
              <button onClick={() => setEditing(null)} className="rounded-md p-1.5 text-slate-500 hover:text-white">
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <ImageUploader
                label="Foto del trabajo *"
                value={editing.image}
                onChange={(url) => setEditing({ ...editing, image: url })}
                previewHeight="h-56"
                hint="Subí una foto de un trabajo realizado (JPG, PNG, WEBP · máx 5 MB)"
                folder="carrusel"
              />

              <div>
                <label className="block text-xs text-slate-400 mb-1">Título (opcional)</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                  placeholder="Ej: Instalación residencial en Palermo"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Subtítulo (opcional)</label>
                <input
                  type="text"
                  value={editing.subtitle}
                  onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                  placeholder="Ej: Cableado, tablero y puesta a tierra completa"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Orden</label>
                <input
                  type="number"
                  value={editing.order}
                  onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.isActive}
                  onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                  className="h-4 w-4 accent-amber-400"
                />
                <span className="text-sm text-white">Activa (visible en el carrusel)</span>
              </label>

              <button
                onClick={save}
                disabled={saving || !editing.image}
                className="w-full rounded-md bg-amber-400 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Guardando…' : isNew ? 'Agregar al carrusel' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PlusIcon() {
  return <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
}
function EyeIcon() {
  return <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
}
function EyeOffIcon() {
  return <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
}
function EditIcon() {
  return <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
}
function TrashIcon() {
  return <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
}
function CloseIcon() {
  return <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
}
function NoImageIcon() {
  return <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V6.75A2.25 2.25 0 0020.25 4.5H3.75A2.25 2.25 0 001.5 6.75v12A2.25 2.25 0 003.75 21z" /></svg>
}
