import { useState, useEffect, useRef } from 'react'
import {
  collection, addDoc, updateDoc, doc, query, orderBy, limit,
  onSnapshot, Timestamp, where, getDocs,
} from 'firebase/firestore'
import { db } from '../../firebase'

function formatElapsed(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return [h, m, sec].map((n) => String(n).padStart(2, '0')).join(':')
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return h > 0 ? `${h}h ${m}min` : `${m} min`
}

function formatDate(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('es-PY', { dateStyle: 'short', timeStyle: 'short' })
}

export default function AdminAsistencia() {
  const [workers, setWorkers] = useState([])
  const [history, setHistory] = useState([])
  const [openSessions, setOpenSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedWorker, setSelectedWorker] = useState('')
  const [workerName, setWorkerName] = useState('')
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState(null)
  const [now, setNow] = useState(Date.now())
  const tickRef = useRef(null)

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'workers'), orderBy('name')),
      (snap) => setWorkers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [])

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'attendance'), orderBy('check_in', 'desc'), limit(50)),
      (snap) => {
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setOpenSessions(all.filter((a) => !a.check_out))
        setHistory(all.filter((a) => a.check_out))
        setLoading(false)
      },
      (err) => {
        setError('Error cargando asistencia: ' + err.message)
        setLoading(false)
      }
    )
    return unsub
  }, [])

  useEffect(() => {
    tickRef.current = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(tickRef.current)
  }, [])

  const resolvedName = selectedWorker
    ? (workers.find((w) => w.id === selectedWorker)?.name ?? workerName)
    : workerName

  const handleCheckIn = async () => {
    const name = resolvedName.trim()
    if (!name) return setError('Seleccioná un trabajador o ingresá el nombre.')
    setStarting(true)
    setError(null)
    try {
      await addDoc(collection(db, 'attendance'), {
        worker_id: selectedWorker || null,
        worker_name: name,
        check_in: Timestamp.now(),
        check_out: null,
      })
      setSelectedWorker('')
      setWorkerName('')
    } catch (e) {
      setError(e.message)
    }
    setStarting(false)
  }

  const handleCheckOut = async (sessionId) => {
    try {
      await updateDoc(doc(db, 'attendance', sessionId), {
        check_out: Timestamp.now(),
      })
    } catch (e) {
      setError('Error al marcar salida: ' + e.message)
    }
  }

  const inputCls =
    'w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none'

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Marcación</h1>
        <p className="mt-0.5 text-sm text-slate-500">Control de asistencia del equipo</p>
      </div>

      {/* Check-in form */}
      <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Registrar entrada</h2>
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        <div className="flex flex-col sm:flex-row gap-3">
          {workers.length > 0 ? (
            <select
              className={`${inputCls} flex-1`}
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
            >
              <option value="">Seleccionar trabajador…</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          ) : (
            <input
              className={`${inputCls} flex-1`}
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
              placeholder="Nombre del trabajador"
            />
          )}
          <button
            onClick={handleCheckIn}
            disabled={starting}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-50 transition-colors active:scale-95"
          >
            <CheckInIcon /> Marcar entrada
          </button>
        </div>
      </div>

      {/* Open sessions */}
      {openSessions.length > 0 && (
        <div className="mb-8 rounded-xl border border-amber-400/20 bg-amber-400/5 overflow-hidden">
          <div className="px-4 py-3 border-b border-amber-400/20 sm:px-6">
            <h2 className="text-sm font-semibold text-amber-400">Jornadas en curso ({openSessions.length})</h2>
          </div>
          <div className="divide-y divide-slate-800/50">
            {openSessions.map((s) => {
              const elapsed = (now - s.check_in.toMillis()) / 1000
              return (
                <div key={s.id} className="flex items-center justify-between px-4 py-3 sm:px-6">
                  <div>
                    <p className="text-sm font-medium text-white">{s.worker_name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Entrada: {formatDate(s.check_in)} · <span className="font-mono text-amber-400">{formatElapsed(elapsed)}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleCheckOut(s.id)}
                    className="ml-4 shrink-0 inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-500 transition-colors active:scale-95"
                  >
                    <CheckOutIcon /> Salida
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* History */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 sm:px-6">
          <h2 className="text-sm font-semibold text-white">Historial</h2>
        </div>
        {loading ? (
          <p className="p-6 text-center text-sm text-slate-500">Cargando…</p>
        ) : history.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500">Sin fichadas todavía</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3 sm:px-6">Trabajador</th>
                  <th className="px-4 py-3 sm:px-6">Entrada</th>
                  <th className="px-4 py-3 sm:px-6">Salida</th>
                  <th className="hidden sm:table-cell px-6 py-3">Duración</th>
                </tr>
              </thead>
              <tbody>
                {history.map((a) => {
                  const dMin = a.check_out
                    ? (a.check_out.toMillis() - a.check_in.toMillis()) / 60000
                    : null
                  return (
                    <tr key={a.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="px-4 py-3 sm:px-6 text-white whitespace-nowrap">{a.worker_name}</td>
                      <td className="px-4 py-3 sm:px-6 text-slate-400 whitespace-nowrap">{formatDate(a.check_in)}</td>
                      <td className="px-4 py-3 sm:px-6 text-slate-400 whitespace-nowrap">{formatDate(a.check_out)}</td>
                      <td className="hidden sm:table-cell px-6 py-3 text-slate-400">
                        {dMin != null ? formatDuration(dMin) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function CheckInIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  )
}
function CheckOutIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  )
}
