import { useState, useEffect, useRef } from 'react'
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, orderBy, limit, onSnapshot, where,
  getDocs, Timestamp, serverTimestamp, increment,
} from 'firebase/firestore'
import { db, auth } from '../../firebase'

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatElapsed(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return [h, m, sec].map((n) => String(n).padStart(2, '0')).join(':')
}

function generateJobCode() {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)
  const suffix = Math.random().toString(36).slice(-4).toUpperCase()
  return `TRB-${stamp}-${suffix}`
}

function formatDate(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('es-PY', { dateStyle: 'short', timeStyle: 'short' })
}

const inputCls =
  'w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none disabled:opacity-40'
const labelCls = 'block text-xs text-slate-400 mb-1.5'

// ─── Main component ──────────────────────────────────────────────────────────

export default function AdminJobs() {
  const [isWorker, setIsWorker] = useState(false)
  const [workerName, setWorkerName] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) { setChecking(false); return }

    getDocs(query(collection(db, 'workers'), where('uid', '==', uid))).then((snap) => {
      if (!snap.empty) {
        const w = snap.docs[0].data()
        setIsWorker(true)
        setWorkerName(w.name || auth.currentUser?.displayName || 'Trabajador')
      }
      setChecking(false)
    })
  }, [])

  if (checking) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-amber-400" />
      </div>
    )
  }

  if (isWorker) return <WorkerView workerName={workerName} />
  return <AdminView />
}

// ─── Admin view ──────────────────────────────────────────────────────────────

function AdminView() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeJob, setActiveJob] = useState(null)   // { id, startedAt, workerName }
  const [elapsed, setElapsed] = useState(0)
  const [starting, setStarting] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [finishingJob, setFinishingJob] = useState(null) // job being finalized (own or other worker's)
  const [error, setError] = useState(null)
  const tickRef = useRef(null)

  const workerDisplayName =
    auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'Admin'

  // Restore own active session on mount — single-field query, no composite index needed
  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return
    getDocs(query(collection(db, 'jobs'), where('started_by', '==', uid), limit(20)))
      .then((snap) => {
        const active = snap.docs.find((d) => d.data().status === 'in_progress')
        if (active) {
          const startedAt = active.data().started_at?.toMillis() ?? Date.now()
          setActiveJob({ id: active.id, startedAt, workerName: active.data().worker_name || workerDisplayName })
        }
      })
  }, [])

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'jobs'), orderBy('started_at', 'desc'), limit(50)),
      (snap) => {
        setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      }
    )
  }, [])

  useEffect(() => {
    if (!activeJob) return
    tickRef.current = setInterval(
      () => setElapsed((Date.now() - activeJob.startedAt) / 1000),
      1000
    )
    return () => clearInterval(tickRef.current)
  }, [activeJob])

  const handleStart = async () => {
    setStarting(true)
    setError(null)
    const startedAt = new Date()
    try {
      const ref = await addDoc(collection(db, 'jobs'), {
        code: generateJobCode(),
        status: 'in_progress',
        started_at: Timestamp.fromDate(startedAt),
        started_by: auth.currentUser?.uid || 'admin',
        worker_name: workerDisplayName,
      })
      setActiveJob({ id: ref.id, startedAt: startedAt.getTime(), workerName: workerDisplayName })
      setElapsed(0)
    } catch (e) {
      setError(e.message)
    }
    setStarting(false)
  }

  const handleCancel = async () => {
    if (!activeJob) return
    clearInterval(tickRef.current)
    await deleteDoc(doc(db, 'jobs', activeJob.id))
    setActiveJob(null)
    setElapsed(0)
  }

  const handleFinishDone = () => {
    clearInterval(tickRef.current)
    setActiveJob(null)
    setElapsed(0)
    setFinishing(false)
    setFinishingJob(null)
  }

  const completed = jobs.filter((j) => j.status === 'completed')
  const inProgress = jobs.filter((j) => j.status === 'in_progress')

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Trabajos</h1>
        <p className="mt-0.5 text-sm text-slate-500">Registrá y gestioná trabajos en tiempo real</p>
      </div>

      {/* Start / active job card */}
      <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
        {!activeJob ? (
          <>
            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
            <button
              onClick={handleStart}
              disabled={starting}
              className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-50 transition-colors active:scale-95"
            >
              <PlayIcon /> Iniciar trabajo
            </button>
          </>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Tu trabajo en curso</span>
                <p className="text-xs text-slate-600 mt-0.5">{workerDisplayName}</p>
              </div>
              <span className="font-mono text-3xl font-bold text-amber-400 tabular-nums">
                {formatElapsed(elapsed)}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { setFinishingJob(activeJob); setFinishing(true) }}
                className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors active:scale-95"
              >
                <StopIcon /> Finalizar trabajo
              </button>
              <button
                onClick={handleCancel}
                className="rounded-md border border-slate-700 px-5 py-3 text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* In-progress jobs from other workers — read-only */}
      {inProgress.filter((j) => j.id !== activeJob?.id).length > 0 && (
        <div className="mb-8 rounded-xl border border-amber-400/20 bg-amber-400/5 overflow-hidden">
          <div className="px-4 py-3 border-b border-amber-400/20 sm:px-6">
            <h2 className="text-sm font-semibold text-amber-400">
              En curso ({inProgress.filter((j) => j.id !== activeJob?.id).length})
            </h2>
          </div>
          {inProgress.filter((j) => j.id !== activeJob?.id).map((j) => (
            <div key={j.id} className="flex items-center justify-between px-4 py-3 sm:px-6 border-b border-slate-800/40 last:border-0">
              <div>
                <p className="text-sm font-medium text-white">{j.worker_name || '—'}</p>
                <p className="text-xs text-slate-500 mt-0.5">{j.code} · inicio: {formatDate(j.started_at)}</p>
              </div>
              <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                En curso
              </span>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 sm:px-6">
          <h2 className="text-sm font-semibold text-white">
            Historial <span className="ml-1 text-slate-500 font-normal">({completed.length})</span>
          </h2>
        </div>
        {loading ? (
          <p className="p-6 text-center text-sm text-slate-500">Cargando…</p>
        ) : completed.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500">Sin trabajos finalizados todavía</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3 sm:px-6">Código</th>
                  <th className="px-4 py-3 sm:px-6">Cliente</th>
                  <th className="hidden sm:table-cell px-6 py-3">Trabajador</th>
                  <th className="hidden md:table-cell px-6 py-3">Descripción</th>
                  <th className="px-4 py-3 sm:px-6">Duración</th>
                  <th className="hidden sm:table-cell px-6 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {completed.map((j) => (
                  <tr key={j.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 cursor-default">
                    <td className="px-4 py-3 sm:px-6 font-mono text-xs text-slate-500 whitespace-nowrap">{j.code}</td>
                    <td className="px-4 py-3 sm:px-6 text-white whitespace-nowrap">{j.client_name || '—'}</td>
                    <td className="hidden sm:table-cell px-6 py-3 text-slate-400 whitespace-nowrap">{j.worker_name || '—'}</td>
                    <td className="hidden md:table-cell px-6 py-3 text-slate-400 max-w-xs truncate">{j.description || '—'}</td>
                    <td className="px-4 py-3 sm:px-6 text-slate-400 whitespace-nowrap">
                      {j.duration_minutes != null ? `${j.duration_minutes} min` : '—'}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-3 text-slate-500 whitespace-nowrap text-xs">
                      {formatDate(j.completed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {finishing && finishingJob && (
        <FinishModal
          activeJob={finishingJob}
          workerName={finishingJob.workerName || workerDisplayName}
          onDone={handleFinishDone}
          onClose={() => { setFinishing(false); setFinishingJob(null) }}
        />
      )}
    </div>
  )
}

// ─── Worker view (centered) ───────────────────────────────────────────────────

function WorkerView({ workerName }) {
  const [activeJob, setActiveJob] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [starting, setStarting] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [error, setError] = useState(null)
  const tickRef = useRef(null)

  // Restore active session on mount — single-field query, no composite index needed
  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return
    getDocs(query(collection(db, 'jobs'), where('started_by', '==', uid), limit(20)))
      .then((snap) => {
        const active = snap.docs.find((d) => d.data().status === 'in_progress')
        if (active) {
          const startedAt = active.data().started_at?.toMillis() ?? Date.now()
          setActiveJob({ id: active.id, startedAt })
        }
      })
  }, [])

  useEffect(() => {
    if (!activeJob) return
    tickRef.current = setInterval(
      () => setElapsed((Date.now() - activeJob.startedAt) / 1000),
      1000
    )
    return () => clearInterval(tickRef.current)
  }, [activeJob])

  const handleStart = async () => {
    setStarting(true)
    setError(null)
    const startedAt = new Date()
    try {
      const ref = await addDoc(collection(db, 'jobs'), {
        code: generateJobCode(),
        status: 'in_progress',
        started_at: Timestamp.fromDate(startedAt),
        started_by: auth.currentUser?.uid,
        worker_name: workerName,
      })
      setActiveJob({ id: ref.id, startedAt: startedAt.getTime() })
      setElapsed(0)
    } catch (e) {
      setError(e.message)
    }
    setStarting(false)
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6 text-center">
      {error && <p className="mb-6 text-sm text-red-400">{error}</p>}

      {!activeJob ? (
        <>
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-amber-400/10 text-5xl">
            ⚡
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white">¿Listo para trabajar?</h2>
          <p className="mb-8 text-sm text-slate-500">{workerName}</p>
          <button
            onClick={handleStart}
            disabled={starting}
            className="inline-flex items-center gap-3 rounded-2xl bg-amber-400 px-10 py-5 text-lg font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-amber-400/20"
          >
            <PlayIcon size={24} /> Iniciar Trabajo
          </button>
        </>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500 uppercase tracking-widest">Trabajo en curso</p>
          <div className="mb-2 font-mono text-6xl font-bold text-amber-400 tabular-nums tracking-tight">
            {formatElapsed(elapsed)}
          </div>
          <p className="mb-10 text-sm text-slate-500">{workerName}</p>
          <button
            onClick={() => setFinishing(true)}
            className="inline-flex items-center gap-3 rounded-2xl bg-amber-400 px-10 py-5 text-lg font-bold text-slate-950 hover:bg-amber-300 transition-all active:scale-95 shadow-lg shadow-amber-400/20"
          >
            <StopIcon size={24} /> Finalizar Trabajo
          </button>
        </>
      )}

      {finishing && activeJob && (
        <FinishModal
          activeJob={activeJob}
          workerName={workerName}
          onDone={() => {
            clearInterval(tickRef.current)
            setActiveJob(null)
            setElapsed(0)
            setFinishing(false)
          }}
          onClose={() => setFinishing(false)}
        />
      )}
    </div>
  )
}

// ─── Finish modal ─────────────────────────────────────────────────────────────

function FinishModal({ activeJob, workerName, onDone, onClose }) {
  const [mode, setMode] = useState('existing') // 'existing' | 'new'
  const [selectedClient, setSelectedClient] = useState(null)
  const [newClient, setNewClient] = useState({ name: '', phone: '', address: '', email: '' })
  const [zone, setZone] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const setNC = (field) => (e) => setNewClient((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const completedAt = new Date()
    const durationMinutes =
      Math.round(((completedAt.getTime() - activeJob.startedAt) / 60000) * 100) / 100

    try {
      let clientId = null
      let clientName = null

      if (mode === 'existing' && selectedClient) {
        clientId = selectedClient.id
        clientName = selectedClient.name
        // Update client stats
        await updateDoc(doc(db, 'clients', clientId), {
          last_job_at: serverTimestamp(),
          job_count: increment(1),
        })
      } else if (mode === 'new' && newClient.name.trim()) {
        const name = newClient.name.trim()
        const ref = await addDoc(collection(db, 'clients'), {
          name,
          name_lower: name.toLowerCase(),
          phone: newClient.phone.trim() || null,
          address: newClient.address.trim() || null,
          email: newClient.email.trim() || null,
          job_count: 1,
          last_job_at: serverTimestamp(),
          created_at: serverTimestamp(),
        })
        clientId = ref.id
        clientName = name
      }

      await updateDoc(doc(db, 'jobs', activeJob.id), {
        client_id: clientId,
        client_name: clientName,
        zone: zone.trim() || null,
        description: description.trim() || null,
        status: 'completed',
        completed_at: Timestamp.fromDate(completedAt),
        duration_minutes: durationMinutes,
      })

      onDone()
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Handle / header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <h2 className="font-semibold text-white">Completar trabajo</h2>
            <p className="text-xs text-slate-500 mt-0.5">{workerName}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-slate-500 hover:text-white transition-colors">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && <p className="text-sm text-red-400">{error}</p>}

          {/* Client section */}
          <div>
            <p className={labelCls}>Cliente</p>
            {/* Toggle */}
            <div className="flex rounded-lg border border-slate-700 overflow-hidden mb-3">
              <button
                type="button"
                onClick={() => { setMode('existing'); setSelectedClient(null) }}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${mode === 'existing' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                Cliente existente
              </button>
              <button
                type="button"
                onClick={() => { setMode('new'); setSelectedClient(null) }}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${mode === 'new' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                Nuevo cliente
              </button>
            </div>

            {mode === 'existing' ? (
              <ClientSearch
                selected={selectedClient}
                onSelect={setSelectedClient}
                onClear={() => setSelectedClient(null)}
              />
            ) : (
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Nombre *</label>
                  <input className={inputCls} value={newClient.name} onChange={setNC('name')} placeholder="Nombre del cliente" required={mode === 'new'} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Teléfono</label>
                    <input className={inputCls} value={newClient.phone} onChange={setNC('phone')} placeholder="+595 9XX…" />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" className={inputCls} value={newClient.email} onChange={setNC('email')} placeholder="opcional" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Dirección</label>
                  <input className={inputCls} value={newClient.address} onChange={setNC('address')} placeholder="Calle, barrio…" />
                </div>
              </div>
            )}
          </div>

          {/* Zone */}
          <div>
            <label className={labelCls}>Zona / Barrio</label>
            <input className={inputCls} value={zone} onChange={(e) => setZone(e.target.value)} placeholder="Ej: San Lorenzo" />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Descripción del trabajo *</label>
            <textarea
              className={`${inputCls} resize-y min-h-28`}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detallá todo lo realizado: materiales usados, problemas encontrados, solución aplicada…"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving || (mode === 'existing' && !selectedClient) || (mode === 'new' && !newClient.name.trim())}
            className="w-full rounded-md bg-amber-400 py-3.5 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-40 transition-colors active:scale-[0.99]"
          >
            {saving ? 'Guardando…' : 'Guardar y cerrar trabajo'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Client search component ──────────────────────────────────────────────────

function ClientSearch({ selected, onSelect, onClear }) {
  const [text, setText] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    const t = text.trim()
    if (!t || t.length < 1) { setResults([]); return }

    const q = query(
      collection(db, 'clients'),
      where('name_lower', '>=', t.toLowerCase()),
      where('name_lower', '<=', t.toLowerCase() + ''),
      orderBy('name_lower'),
      limit(6)
    )
    return onSnapshot(q, (snap) => {
      setResults(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setOpen(true)
    })
  }, [text])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (selected) {
    return (
      <div className="flex items-center justify-between rounded-md border border-amber-400/40 bg-amber-400/5 px-3 py-2.5">
        <div>
          <p className="text-sm font-medium text-white">{selected.name}</p>
          {selected.phone && <p className="text-xs text-slate-500">{selected.phone}</p>}
        </div>
        <button type="button" onClick={onClear} className="ml-2 rounded p-1 text-slate-500 hover:text-white transition-colors">
          <CloseIcon size={14} />
        </button>
      </div>
    )
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        className={inputCls}
        value={text}
        onChange={(e) => { setText(e.target.value); setOpen(true) }}
        placeholder="Buscar cliente por nombre…"
        autoComplete="off"
      />
      {open && results.length > 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-700 bg-slate-900 shadow-xl overflow-hidden">
          {results.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => { onSelect(c); setOpen(false); setText('') }}
              className="flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-0"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-amber-400">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{c.name}</p>
                <p className="text-xs text-slate-500">
                  {[c.phone, c.address].filter(Boolean).join(' · ') || 'Sin datos adicionales'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
      {open && text.length >= 1 && results.length === 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 shadow-xl">
          <p className="text-xs text-slate-500">Sin resultados — usá "Nuevo cliente" para registrarlo</p>
        </div>
      )}
    </div>
  )
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function PlayIcon({ size = 16 }) {
  return (
    <svg style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
function StopIcon({ size = 16 }) {
  return (
    <svg style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 6h12v12H6z" />
    </svg>
  )
}
function CloseIcon({ size = 20 }) {
  return (
    <svg style={{ width: size, height: size }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
