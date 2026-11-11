import { useState } from 'react'
import { useProjects } from '../../hooks/useProjects'
import { ImageUploader, MultiImageUploader } from './ImageUploader'

const CATEGORIES = [
  { value: 'Residencial', label: 'Residencial' },
  { value: 'Comercial', label: 'Comercial' },
  { value: 'Industrial', label: 'Industrial' },
]

const EMPTY = {
  title: '', description: '', category: 'Residencial', location: '',
  year: new Date().getFullYear().toString(), client: '', image: '', gallery: [],
  isActive: true, isFeatured: false, order: 0,
}

export default function AdminProjects() {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects()
  const [editing, setEditing] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  function openNew() {
    setIsNew(true)
    setSaveError('')
    setEditing({ ...EMPTY, order: projects.length })
  }

  function openEdit(project) {
    setIsNew(false)
    setSaveError('')
    setEditing({ ...project })
  }

  async function save() {
    if (!editing?.title?.trim()) return
    setSaving(true)
    setSaveError('')
    try {
      const { id, ...data } = editing
      if (isNew) {
        await createProject(data)
      } else {
        await updateProject(id, data)
      }
      setEditing(null)
    } catch (e) {
      setSaveError(e.message || 'Error al guardar. Verificá tu conexión e intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  async function del(id) {
    if (!confirm('¿Eliminar este proyecto?')) return
    await deleteProject(id)
  }

  async function toggle(project, field) {
    await updateProject(project.id, { [field]: !project[field] })
  }

  return (
    <div className="px-6 py-8">
        {/* Page title */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Proyectos</h1>
            <p className="mt-0.5 text-sm text-slate-500">{projects.length} proyectos en total</p>
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
          >
            <PlusIcon /> Nuevo proyecto
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                <div className="h-40 bg-slate-800" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-800" />
                  <div className="h-3 w-1/2 rounded bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-16 text-center">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-lg font-semibold text-white">Sin proyectos todavía</h3>
            <p className="mt-2 text-sm text-slate-500">Creá el primer proyecto para que aparezca en el sitio.</p>
            <button
              onClick={openNew}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
            >
              <PlusIcon /> Crear proyecto
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div key={p.id} className="group rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                {/* Thumbnail */}
                <div className="relative h-40 bg-slate-800">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-700">
                      <NoImageIcon />
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute left-2 top-2 flex gap-1">
                    <span className="rounded-full bg-slate-950/80 px-2 py-0.5 text-xs text-slate-300 backdrop-blur">
                      {p.category}
                    </span>
                    {p.isFeatured && (
                      <span className="rounded-full bg-amber-400/90 px-2 py-0.5 text-xs font-medium text-slate-950">
                        Destacado
                      </span>
                    )}
                  </div>
                  {!p.isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60">
                      <span className="rounded-full bg-red-500/80 px-3 py-1 text-xs text-white">Inactivo</span>
                    </div>
                  )}
                  {/* Gallery count */}
                  {p.gallery?.length > 0 && (
                    <span className="absolute bottom-2 right-2 rounded bg-slate-950/70 px-1.5 py-0.5 text-xs text-slate-300">
                      +{p.gallery.length} fotos
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-white line-clamp-1">{p.title}</h3>
                  {p.description && (
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{p.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
                    {p.client && <span>{p.client}</span>}
                    {p.location && <span>{p.location}</span>}
                    {p.year && <span>{p.year}</span>}
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center gap-1 border-t border-slate-800 pt-3">
                    <button
                      onClick={() => toggle(p, 'isFeatured')}
                      title={p.isFeatured ? 'Quitar destacado' : 'Marcar destacado'}
                      className={`rounded p-1.5 transition-colors ${p.isFeatured ? 'text-amber-400' : 'text-slate-700 hover:text-slate-400'}`}
                    >
                      <StarIcon filled={p.isFeatured} />
                    </button>
                    <button
                      onClick={() => toggle(p, 'isActive')}
                      title={p.isActive ? 'Desactivar' : 'Activar'}
                      className="rounded p-1.5 text-slate-600 hover:text-slate-300 transition-colors"
                    >
                      {p.isActive ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                    <button
                      onClick={() => openEdit(p)}
                      className="rounded p-1.5 text-slate-600 hover:text-amber-400 transition-colors"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => del(p.id)}
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
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h2 className="font-semibold text-white">
                {isNew ? 'Nuevo proyecto' : 'Editar proyecto'}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="rounded-md p-1.5 text-slate-500 hover:text-white transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal body */}
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Título *</label>
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                    placeholder="Ej: Instalación residencial Palermo"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Descripción</label>
                  <textarea
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                    placeholder="Breve descripción del trabajo realizado"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Categoría</label>
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Año</label>
                  <input
                    type="text"
                    value={editing.year}
                    onChange={(e) => setEditing({ ...editing, year: e.target.value })}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                    placeholder="2024"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Cliente</label>
                  <input
                    type="text"
                    value={editing.client}
                    onChange={(e) => setEditing({ ...editing, client: e.target.value })}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                    placeholder="Nombre del cliente"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Ubicación</label>
                  <input
                    type="text"
                    value={editing.location}
                    onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                    placeholder="Ej: Palermo, CABA"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Orden de visualización</label>
                  <input
                    type="number"
                    value={editing.order}
                    onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <ImageUploader
                    label="Imagen principal"
                    value={editing.image}
                    onChange={(url) => setEditing({ ...editing, image: url })}
                    previewHeight="h-44"
                  />
                </div>

                <div className="col-span-2">
                  <MultiImageUploader
                    label="Galería de fotos adicionales"
                    value={editing.gallery || []}
                    onChange={(urls) => setEditing({ ...editing, gallery: urls })}
                    max={8}
                  />
                </div>

                <div>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editing.isActive}
                      onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                      className="h-4 w-4 accent-amber-400"
                    />
                    <span className="text-sm text-white">Activo (visible en el sitio)</span>
                  </label>
                </div>

                <div>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editing.isFeatured}
                      onChange={(e) => setEditing({ ...editing, isFeatured: e.target.checked })}
                      className="h-4 w-4 accent-amber-400"
                    />
                    <span className="text-sm text-white">Destacado</span>
                  </label>
                </div>
              </div>

              {saveError && (
                <p className="rounded-md bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">{saveError}</p>
              )}
              <button
                onClick={save}
                disabled={saving || !editing.title?.trim()}
                className="w-full rounded-md bg-amber-400 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Guardando…' : isNew ? 'Crear proyecto' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}
function StarIcon({ filled }) {
  return (
    <svg className="h-4 w-4" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  )
}
function EyeIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
function EyeOffIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}
function EditIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  )
}
function TrashIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  )
}
function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
function NoImageIcon() {
  return (
    <svg className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V6.75A2.25 2.25 0 0020.25 4.5H3.75A2.25 2.25 0 001.5 6.75v12A2.25 2.25 0 003.75 21z" />
    </svg>
  )
}
