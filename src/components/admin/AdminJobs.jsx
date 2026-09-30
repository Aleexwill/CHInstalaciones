import { useState, useEffect, useRef } from 'react'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore'
import { db, auth } from '../../firebase'

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

const emptyForm = { client_name: '', zone: '', description: '' }

const inputCls =
  'w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none'
const labelCls = 'block text-xs text-slate-400 mb-1.5'

export default function AdminJobs() {
  const [activeJob, setActiveJob] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [form, setForm] = useState(emptyForm)
  const [jobsList, setJobsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const tickRef = useRef(null)

  useEffect(() => {
    const q = query(collection(db, 'jobs'), orderBy('started_at', 'desc'), limit(30))
    return onSnapshot(q, (snap) => {
      setJobsList(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!activeJob) return
    tickRef.current = setInterval(() => {
      setElapsed((Date.now() - activeJob.startedAt) / 1000)
    }, 1000)
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
      })
      setActiveJob({ id: ref.id, startedAt: startedAt.getTime() })
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
    setForm(emptyForm)
    setError(null)
  }

  const handleFinish = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const completedAt = new Date()
    const durationMinutes =
      Math.round(((completedAt.getTime() - activeJob.startedAt) / 60000) * 100) / 100
    try {
      await updateDoc(doc(db, 'jobs', activeJob.id), {
        client_name: form.client_name || null,
        zone: form.zone || null,
        description: form.description || null,
        status: 'completed',
        completed_at: Timestamp.fromDate(completedAt),
        duration_minutes: durationMinutes,
      })
      clearInterval(tickRef.current)
      setActiveJob(null)
      setElapsed(0)
      setForm(emptyForm)
    } catch (e) {
      setError(e.message)
    }
    setSaving(false)
  }

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Trabajos</h1>
        <p className="mt-0.5 text-sm text-slate-500">Registrá trabajos en tiempo real</p>
      </div>

      {/* Active job card */}
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
          <form onSubmit={handleFinish}>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs text-slate-500 uppercase tracking-wider">En curso</span>
              <span className="font-mono text-3xl font-bold text-amber-400 tabular-nums">
                {formatElapsed(elapsed)}
              </span>
            </div>
            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
              <div>
                <label className={labelCls}>Cliente *</label>
                <input
                  className={inputCls}
                  value={form.client_name}
                  onChange={set('client_name')}
                  placeholder="Nombre del cliente"
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Zona</label>
                <input
                  className={inputCls}
                  value={form.zone}
                  onChange={set('zone')}
                  placeholder="Ej: Palermo"
                />
              </div>
            </div>
            <div className="mb-5">
              <label className={labelCls}>Descripción del trabajo</label>
              <textarea
                className={`${inputCls} resize-y min-h-28`}
                rows={4}
                value={form.description}
                onChange={set('description')}
                placeholder="Detallá todo lo realizado…"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-50 transition-colors active:scale-95"
              >
                <StopIcon /> Finalizar trabajo
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-md border border-slate-700 px-5 py-3 text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* History table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 sm:px-6">
          <h2 className="text-sm font-semibold text-white">Historial</h2>
        </div>
        {loading ? (
          <p className="p-6 text-center text-sm text-slate-500">Cargando…</p>
        ) : jobsList.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500">Sin trabajos todavía</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3 sm:px-6">Código</th>
                  <th className="px-4 py-3 sm:px-6">Cliente</th>
                  <th className="hidden sm:table-cell px-6 py-3">Zona</th>
                  <th className="hidden lg:table-cell px-6 py-3">Descripción</th>
                  <th className="px-4 py-3 sm:px-6">Duración</th>
                  <th className="px-4 py-3 sm:px-6">Estado</th>
                </tr>
              </thead>
              <tbody>
                {jobsList.map((j) => (
                  <tr key={j.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="px-4 py-3 sm:px-6 font-mono text-xs text-slate-500 whitespace-nowrap">{j.code}</td>
                    <td className="px-4 py-3 sm:px-6 text-white whitespace-nowrap">{j.client_name || '—'}</td>
                    <td className="hidden sm:table-cell px-6 py-3 text-slate-400 whitespace-nowrap">{j.zone || '—'}</td>
                    <td className="hidden lg:table-cell px-6 py-3 text-slate-400 max-w-xs truncate">{j.description || '—'}</td>
                    <td className="px-4 py-3 sm:px-6 text-slate-400 whitespace-nowrap">
                      {j.duration_minutes != null ? `${j.duration_minutes} min` : '—'}
                    </td>
                    <td className="px-4 py-3 sm:px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          j.status === 'completed'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-amber-400/10 text-amber-400'
                        }`}
                      >
                        {j.status === 'completed' ? 'Finalizado' : 'En curso'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
function StopIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 6h12v12H6z" />
    </svg>
  )
}
