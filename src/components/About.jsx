const POINTS = [
  'Electricistas matriculados y con experiencia comprobada',
  'Presupuestos claros, sin sorpresas',
  'Materiales de primera calidad',
  'Garantía por escrito en todos los trabajos',
]

export default function About() {
  return (
    <section id="nosotros" data-reveal="pending" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-amber-600 mb-3 block">
            Sobre nosotros
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-bold uppercase leading-none text-slate-900">
            Electrificando hogares e{' '}
            <span className="text-amber-500 italic">industrias</span>
          </h2>
          <p className="mt-5 text-slate-600">
            CH Instalaciones Eléctricas nació con el objetivo de ofrecer un servicio eléctrico
            confiable, seguro y transparente. Hoy acompañamos a cientos de clientes particulares,
            comercios e industrias en todas las etapas de sus proyectos eléctricos.
          </p>

          <ul className="mt-8 space-y-4">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-amber-400/20 text-amber-600">
                  ✓
                </span>
                <span className="text-slate-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-slate-950 p-10 text-white">
          <blockquote className="text-xl leading-relaxed text-slate-200">
            "Nuestro compromiso es que cada instalación funcione perfectamente y, sobre todo,
            de forma segura para las personas que la usan todos los días."
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 font-bold text-slate-950">
              CH
            </span>
            <div>
              <div className="font-semibold">Equipo CH Instalaciones</div>
              <div className="text-sm text-slate-400">Electricistas matriculados</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
