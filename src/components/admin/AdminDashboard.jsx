import { useState } from 'react'

const GROUPS = [
  {
    key: 'sitio',
    label: 'Sitio Web',
    desc: 'Contenido y presentación',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.28)',
    tabKeys: ['proyectos', 'carrusel', 'trabajos'],
    Icon: () => (
      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/>
      </svg>
    ),
  },
  {
    key: 'operaciones',
    label: 'Operaciones',
    desc: 'Equipo y comunicación',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.10)',
    border: 'rgba(251,191,36,0.28)',
    tabKeys: ['marcacion', 'usuarios', 'mensajes'],
    Icon: () => (
      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
      </svg>
    ),
  },
  {
    key: 'admin',
    label: 'Administración',
    desc: 'Accesos y permisos',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.10)',
    border: 'rgba(167,139,250,0.28)',
    tabKeys: ['accesos'],
    Icon: () => (
      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"/>
      </svg>
    ),
  },
]

const TAB_ICONS = {
  proyectos: (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"/>
    </svg>
  ),
  carrusel: (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
    </svg>
  ),
  trabajos: (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"/>
    </svg>
  ),
  marcacion: (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  ),
  usuarios: (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
    </svg>
  ),
  mensajes: (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
    </svg>
  ),
  accesos: (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"/>
    </svg>
  ),
}

export default function AdminDashboard({ visibleTabs, activeTab, unreadMessages, onSelect }) {
  const [flipped, setFlipped] = useState(null)

  const displayGroups = GROUPS
    .map(g => ({ ...g, tabs: visibleTabs.filter(t => g.tabKeys.includes(t.key)) }))
    .filter(g => g.tabs.length > 0)

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-white">Panel de control</h2>
        <p className="text-sm text-slate-400 mt-1">Tocá una sección para ver las opciones</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {displayGroups.map(group => {
          const isFlipped = flipped === group.key
          const isActive = group.tabKeys.includes(activeTab)

          return (
            <div
              key={group.key}
              style={{ perspective: '1000px', minHeight: '220px' }}
              className="relative"
            >
              <div
                className="absolute inset-0 transition-all duration-500 ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* ── Frente ── */}
                <div
                  className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 p-6 cursor-pointer select-none"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    background: `linear-gradient(145deg, #0f172a 60%, ${group.glow} 160%)`,
                    border: `1px solid ${isActive ? group.color : group.border}`,
                    boxShadow: isActive ? `0 0 24px ${group.glow}, inset 0 0 1px ${group.color}` : 'none',
                  }}
                  onClick={() => setFlipped(group.key)}
                >
                  <div style={{ color: group.color }}>
                    <group.Icon />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-white">{group.label}</p>
                    <p className="text-xs text-slate-400 mt-1">{group.desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium mt-1" style={{ color: group.color }}>
                    <span>Ver opciones</span>
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                    </svg>
                  </div>
                </div>

                {/* ── Dorso ── */}
                <div
                  className="absolute inset-0 rounded-2xl flex flex-col p-4"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: `linear-gradient(145deg, #0f172a 60%, ${group.glow} 160%)`,
                    border: `1px solid ${group.color}`,
                    boxShadow: `0 0 24px ${group.glow}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: group.color }}
                    >
                      {group.label}
                    </span>
                    <button
                      onClick={() => setFlipped(null)}
                      className="text-slate-500 hover:text-white transition-colors rounded-lg p-1 hover:bg-white/10"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 flex-1 justify-center">
                    {group.tabs.map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => { onSelect(tab.key); setFlipped(null) }}
                        className="flex items-center gap-3 w-full rounded-xl px-4 py-3.5 text-sm font-medium text-left transition-all active:scale-95"
                        style={{
                          background: activeTab === tab.key
                            ? group.glow
                            : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${activeTab === tab.key ? group.color : 'rgba(255,255,255,0.07)'}`,
                          color: activeTab === tab.key ? group.color : '#e2e8f0',
                        }}
                      >
                        <span style={{ color: activeTab === tab.key ? group.color : '#94a3b8' }}>
                          {TAB_ICONS[tab.key]}
                        </span>
                        <span>{tab.label}</span>
                        {tab.key === 'mensajes' && unreadMessages > 0 && (
                          <span className="ml-auto inline-flex items-center justify-center rounded-full bg-[#0066ff] text-white text-[10px] font-bold leading-none h-5 min-w-[1.25rem] px-1">
                            {unreadMessages}
                          </span>
                        )}
                        {activeTab === tab.key && (
                          <span className="ml-auto text-[10px] uppercase tracking-widest opacity-60">activo</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
