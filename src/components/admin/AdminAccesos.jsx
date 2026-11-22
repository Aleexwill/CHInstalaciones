import { useState, useEffect } from 'react'
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import {
  collection, setDoc, updateDoc, deleteDoc, doc,
  onSnapshot, orderBy, query, serverTimestamp,
} from 'firebase/firestore'
import { db, auth } from '../../firebase'

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBnq_293PX85DyyR-v3DRODev4ELmOJX54',
  authDomain: 'ch-intalaciones.firebaseapp.com',
  projectId: 'ch-intalaciones',
  storageBucket: 'ch-intalaciones.firebasestorage.app',
  messagingSenderId: '23098712267',
  appId: '1:23098712267:web:70d3e6419cb0328493fb4e',
}

function getSecondaryAuth() {
  const existing = getApps().find((a) => a.name === 'secondary')
  return getAuth(existing || initializeApp(FIREBASE_CONFIG, 'secondary'))
}

function generatePassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!'
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const ROLES = [
  { value: 'propietario', label: 'Propietario' },
  { value: 'colaborador', label: 'Colaborador' },
]

const inputCls =
  'w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[#0066ff] focus:outline-none disabled:opacity-50'
const labelCls = 'block text-xs text-slate-400 mb-1.5'

const emptyNew = { name: '', email: '', password: '', role: 'colaborador' }
const emptyLink = { name: '', email: '', uid: '', role: 'colaborador' }

export default function AdminAccesos() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('nueva') // 'nueva' | 'vincular'
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [createdCreds, setCreatedCreds] = useState(null) // { email, password, name }
  const [copied, setCopied] = useState(false)

  const currentUid = auth.currentUser?.uid

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'admin_users'), orderBy('name')),
      (snap) => {
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      }
    )
  }, [])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const switchMode = (m) => {
    setMode(m)
    setForm(m === 'nueva' ? { ...emptyNew, password: generatePassword() } : emptyLink)
    setError(null)
  }

  const openNew = () => {
    setEditingId(null)
    setMode('nueva')
    setForm({ ...emptyNew, password: generatePassword() })
    setError(null)
    setCreatedCreds(null)
    setShowForm(true)
  }

  const openEdit = (u) => {
    setEditingId(u.id)
    setMode('vincular')
    setForm({ name: u.name || '', email: u.email || '', uid: u.uid || u.id, role: u.role || 'colaborador' })
    setError(null)
    setCreatedCreds(null)
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setError(null)
    setCreatedCreds(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (editingId) {
        await updateDoc(doc(db, 'admin_users', editingId), {
          name: form.name.trim(),
          email: form.email.trim() || null,
          role: form.role,
        })
        cancelForm()
      } else if (mode === 'nueva') {
        // Create Firebase Auth user via secondary app (doesn't sign out the admin)
        const secAuth = getSecondaryAuth()
        const { user: newUser } = await createUserWithEmailAndPassword(
          secAuth,
          form.email.trim(),
          form.password
        )
        await updateProfile(newUser, { displayName: form.name.trim() })
        await secAuth.signOut()

        await setDoc(doc(db, 'admin_users', newUser.uid), {
          name: form.name.trim(),
          email: form.email.trim(),
          uid: newUser.uid,
          role: form.role,
          createdAt: serverTimestamp(),
        })

        setCreatedCreds({ name: form.name.trim(), email: form.email.trim(), password: form.password })
        setShowForm(false)
      } else {
        // Link existing UID
        const uid = form.uid.trim()
        if (!uid) { setError('El UID de Firebase es requerido'); setSaving(false); return }
        await setDoc(doc(db, 'admin_users', uid), {
          name: form.name.trim(),
          email: form.email.trim() || null,
          uid,
          role: form.role,
          createdAt: serverTimestamp(),
        })
        cancelForm()
      }
    } catch (err) {
      const msgs = {
        'auth/email-already-in-use': 'Ese email ya tiene una cuenta en Firebase. Usá "Vincular UID existente".',
        'auth/invalid-email': 'El email no es válido.',
        'auth/weak-password': 'La contraseña es demasiado corta (mínimo 6 caracteres).',
      }
      setError(msgs[err.code] || err.message)
    }
    setSaving(false)
  }

  const handleDelete = async (u) => {
    const uid = u.uid || u.id
    if (uid === currentUid) { alert('No podés eliminar tu propio acceso.'); return }
    if (!confirm(`¿Revocar el acceso de ${u.name}? No elimina la cuenta de Firebase, solo el acceso al panel.`)) return
    setDeletingId(u.id)
    await deleteDoc(doc(db, 'admin_users', u.id))
    setDeletingId(null)
  }

  const copyCreds = () => {
    if (!createdCreds) return
    navigator.clipboard.writeText(
      `Acceso al panel de administración\nEmail: ${createdCreds.email}\nContraseña temporal: ${createdCreds.password}\n\nhttps://chinstalaciones.vercel.app/admin`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Accesos al panel</h1>
          <p className="mt-0.5 text-sm text-slate-500">Quién puede entrar y con qué rol</p>
        </div>
        <button
          onClick={openNew}
          className="shrink-0 inline-flex items-center gap-2 rounded-md bg-[#0066ff] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0052cc] transition-colors active:scale-95"
        >
          <PlusIcon /> Nuevo acceso
        </button>
      </div>

      {/* Info roles */}
      <div className="mb-6 grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">Propietario</p>
          <p className="text-sm text-slate-400">Acceso completo: proyectos, carrusel, trabajos, marcación, mensajes y gestión de accesos.</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Colaborador</p>
          <p className="text-sm text-slate-400">Acceso solo a Marcación de asistencia.</p>
        </div>
      </div>

      {/* Credenciales creadas */}
      {createdCreds && (
        <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-green-400 mb-3">✓ Cuenta creada para {createdCreds.name}</p>
              <div className="space-y-1.5 font-mono text-sm">
                <p><span className="text-slate-500">Email:</span> <span className="text-white">{createdCreds.email}</span></p>
                <p><span className="text-slate-500">Contraseña temporal:</span> <span className="text-amber-300 font-bold tracking-wider">{createdCreds.password}</span></p>
              </div>
              <p className="mt-3 text-xs text-slate-500">Compartí estos datos de forma segura. El usuario podrá cambiar la contraseña una vez que ingrese.</p>
            </div>
            <button
              onClick={copyCreds}
              className="shrink-0 rounded-md border border-slate-600 px-3 py-2 text-xs text-slate-300 hover:border-green-500 hover:text-green-400 transition-colors whitespace-nowrap"
            >
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>
          <button onClick={() => setCreatedCreds(null)} className="mt-3 text-xs text-slate-600 hover:text-slate-400 transition-colors">
            Cerrar
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-slate-700 bg-slate-900 p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-white mb-4">
            {editingId ? 'Editar acceso' : 'Nuevo acceso'}
          </h2>

          {/* Mode toggle — solo en creación */}
          {!editingId && (
            <div className="mb-5 flex rounded-lg border border-slate-700 overflow-hidden">
              {[
                { key: 'nueva', label: 'Crear cuenta nueva' },
                { key: 'vincular', label: 'Vincular UID existente' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => switchMode(key)}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    mode === key
                      ? 'bg-[#0066ff] text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {error && <p className="mb-4 text-sm text-red-400 rounded-md bg-red-900/20 px-3 py-2">{error}</p>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Nombre *</label>
              <input className={inputCls} value={form.name} onChange={set('name')} required placeholder="Nombre completo" />
            </div>
            <div>
              <label className={labelCls}>Email {mode === 'nueva' ? '*' : '(opcional)'}</label>
              <input
                type="email"
                className={inputCls}
                value={form.email}
                onChange={set('email')}
                required={mode === 'nueva'}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label className={labelCls}>Rol</label>
              <select className={inputCls} value={form.role} onChange={set('role')}>
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            {mode === 'nueva' ? (
              <div>
                <label className={labelCls}>Contraseña temporal *</label>
                <div className="flex gap-2">
                  <input
                    className={`${inputCls} flex-1 font-mono tracking-wider`}
                    value={form.password}
                    onChange={set('password')}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, password: generatePassword() }))}
                    className="shrink-0 rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-400 hover:text-white hover:border-slate-500 transition-colors whitespace-nowrap"
                    title="Generar contraseña aleatoria"
                  >
                    ↻ Generar
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-600">Se mostrará al crear para que puedas compartirla.</p>
              </div>
            ) : (
              <div>
                <label className={labelCls}>UID de Firebase *</label>
                <div className="flex gap-2">
                  <input
                    className={`${inputCls} flex-1 font-mono text-xs`}
                    value={form.uid}
                    onChange={set('uid')}
                    required={mode === 'vincular'}
                    placeholder="UID del usuario de Firebase Auth"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, uid: auth.currentUser?.uid || '' }))}
                    className="shrink-0 rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-400 hover:text-white hover:border-slate-500 transition-colors whitespace-nowrap"
                  >
                    Mi UID
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-[#0066ff] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0052cc] disabled:opacity-50 transition-colors active:scale-95"
            >
              {saving
                ? 'Guardando…'
                : editingId
                ? 'Guardar cambios'
                : mode === 'nueva'
                ? 'Crear cuenta y vincular'
                : 'Vincular acceso'}
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

      {/* Users list */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-sm text-slate-500">Cargando…</p>
        ) : users.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-500">Sin accesos configurados todavía</p>
            <button
              onClick={openNew}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#0066ff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0052cc] transition-colors"
            >
              <PlusIcon /> Crear el primero
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {users.map((u) => {
              const uid = u.uid || u.id
              const isMe = uid === currentUid
              return (
                <div key={u.id} className="flex items-center gap-3 px-4 py-3 sm:px-6">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-[#00ffff]">
                    {(u.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white truncate">{u.name}</span>
                      {isMe && (
                        <span className="rounded-full bg-[#0066ff]/20 px-2 py-0.5 text-[10px] text-[#0066ff] font-semibold">Tú</span>
                      )}
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        u.role === 'propietario'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {u.role === 'propietario' ? 'Propietario' : 'Colaborador'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-slate-500">
                      {u.email && <span>{u.email}</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => openEdit(u)}
                      className="rounded p-1.5 text-slate-600 hover:text-[#00ffff] transition-colors"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      disabled={deletingId === u.id || isMe}
                      title={isMe ? 'No podés eliminar tu propio acceso' : 'Revocar acceso'}
                      className="rounded p-1.5 text-slate-700 hover:text-red-400 disabled:opacity-30 transition-colors"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function PlusIcon() {
  return <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
}
function EditIcon() {
  return <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>
}
function TrashIcon() {
  return <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
}
