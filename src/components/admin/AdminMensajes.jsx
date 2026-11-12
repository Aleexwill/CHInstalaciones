import { useState, useEffect } from 'react'
import {
  collection, query, orderBy, onSnapshot,
  updateDoc, deleteDoc, doc,
} from 'firebase/firestore'
import { db } from '../../firebase'

function formatDate(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('es-PY', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function AdminMensajes() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc')),
      (snap) => {
        setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      }
    )
  }, [])

  const toggle = async (msg) => {
    const next = msg.id === expanded ? null : msg.id
    setExpanded(next)
    if (next && !msg.read) {
      await updateDoc(doc(db, 'contact_messages', msg.id), { read: true })
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!confirm('¿Eliminar este mensaje?')) return
    setDeletingId(id)
    await deleteDoc(doc(db, 'contact_messages', id))
    setDeletingId(null)
    if (expanded === id) setExpanded(null)
  }

  const unread = messages.filter((m) => !m.read).length

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Mensajes</h1>
            {unread > 0 && (
              <span className="inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-950 leading-none">
                {unread}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-slate-500">
            {messages.length} mensajes · {unread} sin leer
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-16 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-amber-400" />
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-16 text-center">
          <div className="mb-4 text-4xl">📭</div>
          <h3 className="text-lg font-semibold text-white">Sin mensajes todavía</h3>
          <p className="mt-2 text-sm text-slate-500">Los mensajes del formulario de contacto aparecerán aquí.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden divide-y divide-slate-800">
          {messages.map((msg) => {
            const isOpen = expanded === msg.id
            return (
              <div
                key={msg.id}
                className={`transition-colors ${!msg.read ? 'bg-amber-400/5' : ''}`}
              >
                {/* Header row — always visible */}
                <button
                  type="button"
                  onClick={() => toggle(msg)}
                  className="w-full text-left px-4 py-3.5 sm:px-6 flex items-start gap-3 hover:bg-slate-800/40 transition-colors"
                >
                  {/* Unread dot */}
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full transition-opacity ${
                      msg.read ? 'opacity-0' : 'bg-amber-400 opacity-100'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className={`text-sm font-medium ${msg.read ? 'text-slate-300' : 'text-white'}`}>
                        {msg.name || '(sin nombre)'}
                      </span>
                      {msg.email && (
                        <span className="text-xs text-slate-500 truncate">{msg.email}</span>
                      )}
                      {msg.phone && (
                        <span className="text-xs text-slate-600">{msg.phone}</span>
                      )}
                    </div>
                    <p className={`mt-0.5 text-xs line-clamp-1 ${msg.read ? 'text-slate-600' : 'text-slate-400'}`}>
                      {msg.message}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 ml-2">
                    <span className="hidden sm:block text-xs text-slate-600 whitespace-nowrap">
                      {formatDate(msg.createdAt)}
                    </span>
                    <ChevronIcon open={isOpen} />
                  </div>
                </button>

                {/* Expanded body */}
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-6 sm:pb-5">
                    <div className="rounded-lg border border-slate-700 bg-slate-950 p-4 space-y-3">
                      {/* Contact details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <Detail label="Nombre" value={msg.name} />
                        <Detail label="Email" value={msg.email} href={msg.email ? `mailto:${msg.email}` : null} />
                        <Detail label="Teléfono" value={msg.phone} href={msg.phone ? `tel:${msg.phone}` : null} />
                      </div>
                      {/* Message */}
                      <div>
                        <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Mensaje</p>
                        <p className="text-sm text-slate-200 whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      {/* Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                        <span className="text-xs text-slate-600">{formatDate(msg.createdAt)}</span>
                        <div className="flex gap-2">
                          {msg.email && (
                            <a
                              href={`mailto:${msg.email}`}
                              className="inline-flex items-center gap-1.5 rounded-md bg-amber-400 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
                            >
                              <MailIcon /> Responder
                            </a>
                          )}
                          <button
                            onClick={(e) => handleDelete(msg.id, e)}
                            disabled={deletingId === msg.id}
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-1.5 text-xs text-red-400 hover:border-red-700 hover:bg-red-950/30 disabled:opacity-50 transition-colors"
                          >
                            <TrashIcon /> Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Detail({ label, value, href }) {
  return (
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
      {value ? (
        href ? (
          <a href={href} className="text-sm text-amber-400 hover:text-amber-300 transition-colors break-all">
            {value}
          </a>
        ) : (
          <p className="text-sm text-slate-200">{value}</p>
        )
      ) : (
        <p className="text-sm text-slate-600">—</p>
      )}
    </div>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg
      className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  )
}
