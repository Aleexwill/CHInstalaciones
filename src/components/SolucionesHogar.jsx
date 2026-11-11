const SERVICIOS = [
  {
    num: '1',
    title: 'Instalación de ventiladores de techo',
    desc: 'Mejora la ventilación y el confort de tus espacios.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <circle cx="24" cy="22" r="3"/>
        <path d="M24 6v13"/>
        <path d="M24 22c-3-6-8-8-12-6 1 4 5 7 12 6z"/>
        <path d="M24 22c6-3 8-8 6-12-4 1-7 5-6 12z"/>
        <path d="M24 22c3 6 8 8 12 6-1-4-5-7-12-6z"/>
        <path d="M24 22c-6 3-8 8-6 12 4-1 7-5 6-12z"/>
        <path d="M24 25v6"/><circle cx="24" cy="32" r="2"/>
      </svg>
    ),
  },
  {
    num: '2',
    title: 'Cambio e instalación de duchas',
    desc: 'Instalación segura y eficiente para tu comodidad.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <path d="M10 10c0-4 3-6 6-6s6 2 6 6v18H10V10z"/>
        <path d="M22 20h16v4H22"/>
        <path d="M26 30v2M30 30v2M34 30v2M28 34v2M32 34v2"/>
      </svg>
    ),
  },
  {
    num: '3',
    title: 'Colocación de luminarias LED y reflectores',
    desc: 'Ilumina tus espacios con seguridad y ahorro energético.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <path d="M24 6v4M24 10c-5.5 0-9 4-9 8 0 3.5 2 6 5 7.5V30h8v-4.5c3-1.5 5-4 5-7.5 0-4-3.5-8-9-8z"/>
        <path d="M20 30v2a2 2 0 004 0v-2"/>
        <path d="M10 14l2.5 2.5M38 14l-2.5 2.5M6 24h4M38 24h4"/>
      </svg>
    ),
  },
  {
    num: '4',
    title: 'Cambio de tomacorrientes, interruptores y tapas',
    desc: 'Renueva y mejora la seguridad de tus instalaciones.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <rect x="10" y="10" width="12" height="16" rx="1.5"/>
        <rect x="26" y="10" width="12" height="16" rx="1.5"/>
        <path d="M14 14v4M18 14v4"/>
        <circle cx="32" cy="18" r="3"/>
        <path d="M10 30h12v8H10zM26 30h12v8H26z"/>
      </svg>
    ),
  },
  {
    num: '5',
    title: 'Instalación de alarmas básicas',
    desc: 'Protege tu hogar o negocio con sistemas confiables y fáciles de usar.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <path d="M24 6l-14 8v12c0 8 6 14 14 16 8-2 14-8 14-16V14L24 6z"/>
        <path d="M18 24l4 4 8-8"/>
      </svg>
    ),
  },
  {
    num: '6',
    title: 'Instalación de nuevos tomacorrientes',
    desc: 'Más puntos de conexión donde los necesitás, con seguridad y calidad.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <rect x="12" y="10" width="24" height="28" rx="3"/>
        <path d="M19 20v6M29 20v6"/>
        <circle cx="24" cy="30" r="2"/>
      </svg>
    ),
  },
  {
    num: '7',
    title: 'Cambio de llaves térmicas y disyuntores',
    desc: 'Protege tu instalación eléctrica y evita sobrecargas.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <rect x="8" y="6" width="32" height="36" rx="2"/>
        <path d="M16 14h16M16 20h16M16 26h10"/>
        <path d="M34 28l-4 4 2 8 4-4-2-8z"/>
      </svg>
    ),
  },
  {
    num: '8',
    title: 'Reparación de cortocircuitos y fallas',
    desc: 'Solucionamos fallas eléctricas de forma rápida y segura.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <path d="M28 6l-10 18h10L18 42"/>
        <circle cx="24" cy="24" r="18" strokeDasharray="4 3"/>
      </svg>
    ),
  },
  {
    num: '9',
    title: 'Detección de fugas de corriente',
    desc: 'Identificamos y corregimos fugas para proteger tu hogar o negocio.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <path d="M8 36c4-8 8-12 16-12s12 4 16 12"/>
        <circle cx="24" cy="20" r="6"/>
        <path d="M24 6v8M24 26v4M12 14l4 4M36 14l-4 4"/>
      </svg>
    ),
  },
  {
    num: '10',
    title: 'Reparación de enchufes flojos o quemados',
    desc: 'Reparación o cambio de enchufes dañados para tu seguridad.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <path d="M16 10h16l2 8H14l2-8z"/>
        <rect x="12" y="18" width="24" height="20" rx="2"/>
        <path d="M20 28v4M28 28v4"/>
      </svg>
    ),
  },
  {
    num: '11',
    title: 'Reemplazo de focos y tubos LED',
    desc: 'Mejora la iluminación y ahorra energía con tecnología LED.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <path d="M24 8c-6 0-10 4.5-10 9 0 4 2.5 7 6 8.5V30h8v-4.5c3.5-1.5 6-4.5 6-8.5 0-4.5-4-9-10-9z"/>
        <path d="M20 30h8M21 34h6M22 38h4"/>
      </svg>
    ),
  },
  {
    num: '12',
    title: 'Instalación de soportes para TV',
    desc: 'Instalación segura y con ocultamiento de cables.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <rect x="8" y="12" width="32" height="22" rx="2"/>
        <path d="M16 34v4M32 34v4M12 38h24"/>
        <path d="M4 16h4M40 16h4"/>
      </svg>
    ),
  },
  {
    num: '13',
    title: 'Organización y canalización de cables',
    desc: 'Orden y seguridad para tus espacios con canaletas profesionales.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <path d="M6 16h36v8H6z"/>
        <path d="M6 28h36v8H6z"/>
        <path d="M14 16V10M24 16V10M34 16V10M14 36v6M24 36v6M34 36v6"/>
      </svg>
    ),
  },
  {
    num: '14',
    title: 'Instalación de timbres inalámbricos',
    desc: 'Fácil instalación, sin cables y con gran alcance.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <path d="M16 12c2.5-3 6-5 8-5s5.5 2 8 5"/>
        <path d="M20 17c1-1.5 2.5-2.5 4-2.5s3 1 4 2.5"/>
        <rect x="18" y="20" width="12" height="14" rx="3"/>
        <circle cx="24" cy="27" r="2"/>
        <path d="M20 38c0 2 1.8 4 4 4s4-2 4-4"/>
      </svg>
    ),
  },
  {
    num: '15',
    title: 'Colocación de luces de emergencia',
    desc: 'Iluminación confiable cuando más la necesitás.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <rect x="10" y="18" width="28" height="16" rx="2"/>
        <circle cx="18" cy="26" r="4"/>
        <circle cx="30" cy="26" r="4"/>
        <path d="M14 26l-6-4M34 26l6-4"/>
        <path d="M18 14v4M30 14v4"/>
        <path d="M22 10h4"/>
      </svg>
    ),
  },
  {
    num: '16',
    title: 'Instalación de UPS y protectores de tensión',
    desc: 'Protege tus equipos electrónicos de variaciones de voltaje.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <rect x="10" y="14" width="28" height="22" rx="2"/>
        <path d="M18 20v8M24 18v12M30 20v8"/>
        <path d="M10 30h28"/>
        <path d="M16 36v4M32 36v4M20 40h8"/>
      </svg>
    ),
  },
  {
    num: '17',
    title: 'Cambio de tableros pequeños',
    desc: 'Renovamos tu tablero eléctrico con seguridad y normas vigentes.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <rect x="8" y="6" width="32" height="36" rx="2"/>
        <path d="M8 16h32"/>
        <rect x="14" y="20" width="8" height="10" rx="1"/>
        <rect x="26" y="20" width="8" height="10" rx="1"/>
        <circle cx="18" cy="34" r="2"/>
        <circle cx="30" cy="34" r="2"/>
      </svg>
    ),
  },
  {
    num: '18',
    title: 'Puesta a tierra de equipos y viviendas',
    desc: 'Protege a las personas y equipos de descargas eléctricas.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <path d="M24 6v22"/>
        <path d="M12 28h24M16 34h16M20 40h8"/>
      </svg>
    ),
  },
  {
    num: '19',
    title: 'Instalación de reflectores para patios y jardines',
    desc: 'Más seguridad y visibilidad para tus espacios exteriores.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <path d="M10 30l8-14h12l8 14H10z"/>
        <path d="M18 30v8h12v-8"/>
        <path d="M24 16V8M10 30l-6 2M38 30l6 2"/>
        <path d="M20 34h8"/>
      </svg>
    ),
  },
  {
    num: '20',
    title: 'Instalación de repetidores Wi-Fi y cableado de red',
    desc: 'Mejora tu conexión a internet en todo tu hogar o negocio.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <path d="M8 20c4.5-5.5 10-8 16-8s11.5 2.5 16 8"/>
        <path d="M14 26c2.8-3.5 6-5 10-5s7.2 1.5 10 5"/>
        <path d="M20 32c1.5-2 2.5-3 4-3s2.5 1 4 3"/>
        <circle cx="24" cy="38" r="2.5"/>
      </svg>
    ),
  },
  {
    num: '21',
    title: 'Instalación de cámaras IP y configuración',
    desc: 'Vigila tu hogar o negocio desde donde estés.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <rect x="6" y="16" width="26" height="18" rx="3"/>
        <path d="M32 21l8-5v16l-8-5V21z"/>
        <circle cx="18" cy="25" r="4"/>
      </svg>
    ),
  },
  {
    num: '22',
    title: 'Mantenimiento preventivo de instalaciones',
    desc: 'Previene fallas y alarga la vida útil de tu instalación.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <path d="M36 12c0 0-2-4-8-4s-10 4-10 10c0 4 2 7 5 9L10 40l4 4 13-13c2 1 4 1.5 6 1.5 6.5 0 10-4.5 10-10 0-4-2.5-7.5-4-8l-4 5-4-3 5-4.5z"/>
      </svg>
    ),
  },
  {
    num: '23',
    title: 'Inspección eléctrica con informe',
    desc: 'Diagnóstico completo y recomendaciones profesionales para viviendas y comercios.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <path d="M14 6h20a2 2 0 012 2v32a2 2 0 01-2 2H14a2 2 0 01-2-2V8a2 2 0 012-2z"/>
        <path d="M18 16h12M18 22h12M18 28h8"/>
        <path strokeWidth="2" d="M28 32l2 2 4-4"/>
      </svg>
    ),
  },
  {
    num: '24',
    title: 'Tomas eléctricas para portones o bombas de agua',
    desc: 'Conexiones seguras y resistentes para tus equipos.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
        <rect x="14" y="10" width="20" height="28" rx="2"/>
        <path d="M20 20v8M28 20v8"/>
        <circle cx="24" cy="32" r="2"/>
        <path d="M24 6v4M24 38v4M10 24H6M42 24h-4"/>
      </svg>
    ),
  },
]

const GARANTIAS = [
  { icon: ShieldIcon, text: 'Calidad garantizada' },
  { icon: ClockIcon,  text: 'Trabajo seguro' },
  { icon: StarIcon,   text: 'Responsabilidad' },
  { icon: CheckIcon,  text: 'Servicio confiable' },
]

export default function SolucionesHogar() {
  return (
    <section id="hogar" data-reveal="pending" className="bg-slate-950 py-20">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-400 mb-3">
            ¿Qué podemos hacer por vos?
          </span>
          <h2
            className="font-display text-5xl md:text-6xl font-bold uppercase leading-none text-white"
          >
            Nuestros{' '}
            <span className="text-amber-400 italic">servicios</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Desde pequeñas reparaciones hasta instalaciones completas.{' '}
            <span className="text-amber-400 font-medium">Siempre con seguridad y profesionalismo.</span>
          </p>
        </div>

        {/* Grid de servicios */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-slate-800 rounded-xl overflow-hidden border border-slate-800">
          {SERVICIOS.map((s) => (
            <div
              key={s.num}
              className="bg-slate-900 p-5 flex flex-col items-center text-center gap-2.5 hover:bg-slate-800 transition-colors group"
            >
              <div className="relative mt-1">
                <span
                  className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-xs font-bold font-display"
                >
                  {s.num}
                </span>
                <div className="text-amber-400/70 group-hover:text-amber-400 transition-colors pl-3 pt-1">
                  {s.svg}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-200 leading-tight">
                  {s.title}
                </p>
                <p className="mt-1 text-xs text-slate-500 leading-snug">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Garantías */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GARANTIAS.map((g) => (
            <div key={g.text} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
              <g.icon />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300 leading-tight">
                {g.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA WhatsApp */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-amber-400/30 bg-amber-400/5 px-6 py-5">
          <div className="flex items-center gap-4">
            <WhatsAppIcon />
            <div>
              <p className="text-sm text-slate-400">¿Necesitás alguno de estos servicios?</p>
              <p
                className="text-xl font-bold font-display text-white uppercase"
              >
                ¡Consultanos sin compromiso!
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/595984480486"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg bg-amber-400 px-6 py-3 font-bold font-display text-xl tracking-wide text-slate-950 hover:bg-amber-300 transition-colors"
          >
            <WhatsAppIcon dark />
            0984 480 486
          </a>
        </div>

      </div>
    </section>
  )
}

function ShieldIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function StarIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function WhatsAppIcon({ dark = false }) {
  return (
    <svg className={`h-7 w-7 flex-shrink-0 ${dark ? 'text-slate-950' : 'text-[#25D366]'}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
