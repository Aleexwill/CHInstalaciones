import { useState, useEffect } from 'react'
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore'
import { db, auth } from '../../firebase'

const ROLES = ['Electricista', 'Técnico', 'Ayudante', 'Administrativo', 'Otro']

const emptyForm = { name: '', email: '', phone: '', role: 'Electricista', uid: '', isActive: true }

const inputCls =
  'w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none disabled:opacity-50'
const labelCls = 'block text-xs text-slate-400 mb-1.5'

export default function AdminUsuarios() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'workers'), orderBy('name')),
      (snap) => {
        setWorkers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      }
    )
  }, [])

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setShowForm(true)
  }

  const openEdit = (w) => {
    setEditingId(w.id)
    setForm({ name: w.name, email: w.email || '', phone: w.phone || '', role: w.role || 'Electricista', uid: w.uid || '', isActive: w.isActive !== false })
    setError(null)
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (editingId) {
        await updateDoc(doc(db, 'workers', editingId), {
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          role: form.role,
          uid: form.uid.trim() || null,
          isActive: form.isActive,
        })
      } else {
        await addDoc(collection(db, 'workers'), {
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          role: form.role,
          uid: form.uid.trim() || null,
          isActive: true,
          created_at: serverTimestamp(),
        })
      }
      cancelForm()
    } catch (e) {
      setError(e.message)
    }
    setSaving(false)
  }

  const handleDelete = async (w) => {
    if (!confirm(`¿Eliminar a ${w.name}? Esta acción no se puede deshacer.`)) return
    setDeletingId(w.id)
    await deleteDoc(doc(db, 'workers', w.id))
    setDeletingId(null)
  }

  const toggleActive = async (w) => {
    await updateDoc(doc(db, 'workers', w.id), { isActive: !w.isActive })
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Usuarios</h1>
          <p className="mt-0.5 text-sm text-slate-500">{workers.length} trabajadores registrados</p>
        </div>
        <button
          onClick={openNew}
          className="shrink-0 inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors active:scale-95"
        >
          <PlusIcon /> Nuevo
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl border border-slate-700 bg-slate-900 p-4 sm:p-6"
        >
          <h2 className="text-sm font-semibold text-white mb-4">
            {editingId ? 'Editar trabajador' : 'Nuevo trabajador'}
          </h2>
          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Nombre *</label>
              <input className={inputCls} value={form.name} onChange={set('name')} required placeholder="Nombre completo" />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" className={inputCls} value={form.email} onChange={set('email')} placeholder="correo@ejemplo.com" />
            </div>
            <div>
              <label className={labelCls}>Teléfono</label>
              <input className={inputCls} value={form.phone} onChange={set('phone')} placeholder="+595 9XX XXX XXX" />
            </div>
            <div>
              <label className={labelCls}>Rol</label>
              <select className={inputCls} value={form.role} onChange={set('role')}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>UID Firebase (para acceso como trabajador)</label>
              <div className="flex gap-2">
                <input
                  className={`${inputCls} flex-1 font-mono text-xs`}
                  value={form.uid}
                  onChange={set('uid')}
                  placeholder="Pegá el UID de Firebase Auth del trabajador"
                />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, uid: auth.currentUser?.uid || '' }))}
                  className="shrink-0 rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-400 hover:text-white hover:border-slate-500 transition-colors whitespace-nowrap"
                  title="Usar el UID del usuario logueado actualmente"
                >
                  Mi UID
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-600">Opcional — necesario solo si el trabajador inicia sesión en este panel</p>
            </div>
            {editingId && (
              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={set('isActive')}
                    className="h-4 w-4 accent-amber-400"
                  />
                  <span className="text-sm text-white">Activo</span>
                </label>
              </div>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-50 transition-colors active:scale-95"
            >
              {saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Crear trabajador'}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="rounded-md border border-slate-700 px-5 py-2.5 text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Workers list */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-sm text-slate-500">Cargando…</p>
        ) : workers.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-500">Sin trabajadores todavía</p>
            <button onClick={openNew} className="mt-4 inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors">
              <PlusIcon /> Crear el primero
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {workers.map((w) => (
              <div key={w.id} className="flex items-center gap-3 px-4 py-3 sm:px-6">
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-amber-400">
                  {w.name.charAt(0).toUpperCase()}
                </div>
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">{w.name}</span>
                    {!w.isActive && (
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-500">Inactivo</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-slate-500">
                    <span>{w.role}</span>
                    {w.phone && <span>{w.phone}</span>}
                    {w.email && <span className="hidden sm:inline">{w.email}</span>}
                    {w.uid && (
                      <span className="rounded bg-amber-400/10 px-1.5 py-0.5 text-amber-500 font-mono text-[10px]">vinculado</span>
                    )}
                  </div>
                </div>
                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => toggleActive(w)}
                    title={w.isActive ? 'Desactivar' : 'Activar'}
                    className="rounded p-1.5 text-slate-600 hover:text-slate-300 transition-colors"
                  >
                    {w.isActive ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                  <button
                    onClick={() => openEdit(w)}
                    className="rounded p-1.5 text-slate-600 hover:text-amber-400 transition-colors"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(w)}
                    disabled={deletingId === w.id}
                    className="rounded p-1.5 text-slate-700 hover:text-red-400 disabled:opacity-50 transition-colors"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
function EditIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
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
function EyeIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
