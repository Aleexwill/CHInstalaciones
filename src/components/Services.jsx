const SERVICES = [
  {
    title: 'Instalaciones residenciales',
    desc: 'Cableado, tableros, iluminación y puesta a tierra para casas y departamentos.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
        <path d="M6 22L24 6l18 16v20H30V28H18v14H6V22z"/>
        <path d="M20 48V34h8v14"/>
      </svg>
    ),
  },
  {
    title: 'Instalaciones comerciales',
    desc: 'Proyectos eléctricos para oficinas, locales y edificios comerciales.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
        <rect x="4" y="14" width="40" height="30" rx="1.5"/>
        <path d="M4 22h40"/>
        <path d="M16 14V8a2 2 0 012-2h12a2 2 0 012 2v6"/>
        <path d="M16 30h4M28 30h4M16 36h4M28 36h4"/>
      </svg>
    ),
  },
  {
    title: 'Mantenimiento preventivo',
    desc: 'Revisiones periódicas para prevenir fallas y prolongar la vida útil de tu instalación.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
        <path d="M36 12c0 0-2-4-8-4s-10 4-10 10c0 4 2 7 5 9L10 40l4 4 14-13c2 1 4 1.5 6 1.5 6.5 0 10-4.5 10-10 0-4-2.5-7.5-4-8l-4 5-4-3 4-4.5z"/>
      </svg>
    ),
  },
  {
    title: 'Urgencias eléctricas',
    desc: 'Atención rápida ante cortocircuitos, apagones y fallas eléctricas críticas.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
        <circle cx="24" cy="24" r="18"/>
        <path d="M24 12v4M24 32v4M12 24h4M32 24h4"/>
        <path strokeWidth="2" d="M27 18l-6 8h6l-6 8"/>
      </svg>
    ),
  },
]

export default function Services() {
  return (
    <section id="servicios" data-scroll className="bg-slate-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-amber-400">
            Servicios
          </span>
          <h2
            className="mt-2 text-4xl md:text-5xl font-bold font-display uppercase leading-none text-white"
          >
            Soluciones eléctricas{' '}
            <span className="text-amber-400 italic">para cada necesidad</span>
          </h2>
          <p className="mt-4 text-slate-400">
            Trabajamos con los más altos estándares de seguridad y calidad, cumpliendo con la
            normativa eléctrica vigente en cada instalación.
          </p>
        </div>

        <div className="mt-12 grid gap-px bg-slate-800 sm:grid-cols-2 rounded-xl overflow-hidden border border-slate-800">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="bg-slate-900 p-10 flex flex-col gap-5 hover:bg-slate-800 transition-colors group min-h-[220px]"
            >
              <div className="text-amber-400/70 group-hover:text-amber-400 transition-colors [&_svg]:h-14 [&_svg]:w-14">
                {service.svg}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{service.title}</h3>
                <p className="mt-2 text-slate-400 leading-relaxed">{service.desc}</p>
              </div>
            </div>
          ))}

          {/* EV charger — featured card spanning both columns */}
          <div className="sm:col-span-2 relative overflow-hidden min-h-[300px] group">
            {/* Photo — focussed on the right half (charger + car) */}
            <img
              src="/ev-charger.jpg"
              alt="Instalación de cargador para vehículo eléctrico en garaje"
              className="absolute inset-0 h-full w-full object-cover object-right transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient overlay so text is readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/20" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-center gap-5 p-10 sm:max-w-xl">
              <div className="text-amber-400/70 group-hover:text-amber-400 transition-colors">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-14 w-14">
                  <rect x="14" y="4" width="20" height="28" rx="3"/>
                  <path d="M24 32v12"/>
                  <path d="M18 44h12"/>
                  <path d="M19 12h10M19 18h10"/>
                  <path d="M24 4v-3M20 4V1M28 4V1"/>
                  <circle cx="38" cy="20" r="6"/>
                  <path strokeWidth="2" d="M40 17l-3 4h3l-3 4"/>
                </svg>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Nuevo servicio</span>
                <h3 className="mt-1 text-xl font-bold text-white leading-snug">
                  Instalación de cargadores para vehículos eléctricos e híbridos enchufables
                </h3>
                <p className="mt-3 text-slate-300 leading-relaxed">
                  Instalamos puntos de carga monofásicos y trifásicos en tu hogar o negocio,
                  con protecciones eléctricas, puesta a tierra y adaptación según tu vehículo.
                  <span className="mt-2 block text-sm text-slate-400">
                    Realizamos únicamente la instalación eléctrica — no vendemos cargadores.
                  </span>
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Monofásico', 'Trifásico', 'Protecciones', 'Puesta a tierra'].map((tag) => (
                    <span key={tag} className="rounded-full border border-amber-400/30 px-3 py-1 text-xs text-amber-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
