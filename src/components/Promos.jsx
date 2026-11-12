import { useState, useEffect, useCallback } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const SLIDES = [
  {
    id: 'lavavajillas',
    image: '/promos/lavavajillas.jpg',
    title: 'Instalación profesional de lavavajillas',
    highlights: [
      'Conexión eléctrica segura y dedicada (20A / 30A)',
      'Cableado certificado y seguro',
      'Tomas de agua y desagüe certificadas',
      'Nivelación precisa y anclaje a gabinete',
    ],
  },
  {
    id: 'cargadores-ev',
    image: '/promos/cargadores-ev.jpg',
    title: 'Cargadores para vehículos híbridos y eléctricos',
    highlights: [
      'Instalación certificada Tipo 2 / CCS',
      'Protección de sobretensiones avanzada',
      'Gestión dinámica de potencia',
      'Conectividad inteligente (App Control)',
    ],
  },
  {
    id: 'camaras',
    image: '/promos/camaras.jpg',
    title: 'Cámaras de seguridad para tu hogar o negocio',
    highlights: [
      'Monitoreo total 24/7',
      'Vista en vivo desde el celular',
      'Instalación técnica y estética',
      'Configuración completa y prolija',
    ],
  },
]

const INTERVAL = 6000

export default function Promos() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const reducedMotion = useReducedMotion()

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), [])
  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)

  useEffect(() => {
    if (paused || reducedMotion) return
    const t = setInterval(next, INTERVAL)
    return () => clearInterval(t)
  }, [next, paused, reducedMotion])

  const slide = SLIDES[current]

  return (
    <section data-scroll className="bg-slate-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-sm font-semibold uppercase tracking-widest text-amber-400">
            Servicios especiales
          </span>
          <h2
            className="mt-2 text-4xl md:text-5xl font-bold font-display uppercase leading-none text-white"
          >
            Instalaciones{' '}
            <span className="text-amber-400 italic">que marcan la diferencia</span>
          </h2>
        </div>

        {/* Carousel */}
        <div
          className="relative flex flex-col lg:flex-row gap-0 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Image panel */}
          <div className="relative lg:w-1/2 aspect-[4/5] lg:aspect-auto overflow-hidden">
            {SLIDES.map((s, i) => (
              <img
                key={s.id}
                src={s.image}
                alt={s.title}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  i === current ? 'opacity-100' : 'opacity-0'
                }`}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ))}
            {/* gradient overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/60 hidden lg:block" />
          </div>

          {/* Detail panel */}
          <div className="lg:w-1/2 flex flex-col justify-center p-10 lg:p-14 gap-6">
            <div>
              <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">
                {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
              </p>
              <h3
                className="text-2xl md:text-3xl font-bold font-display text-white leading-snug"
              >
                {slide.title}
              </h3>
            </div>

            <ul className="space-y-3">
              {slide.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300">
                  <span className="mt-1 flex-shrink-0 h-4 w-4 rounded-full bg-amber-400/20 flex items-center justify-center">
                    <span className="block h-1.5 w-1.5 rounded-full bg-amber-400" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="https://wa.me/595984480486"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start rounded-md bg-amber-400 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Consultar ahora
            </a>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={prev}
                className="rounded-full border border-slate-700 p-3 text-slate-400 hover:border-amber-400 hover:text-amber-400 transition-colors"
                aria-label="Anterior"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <div className="flex gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`rounded-full transition-all duration-300 p-2.5 -m-2.5 ${
                      i === current ? 'w-6 h-2 bg-amber-400' : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="rounded-full border border-slate-700 p-3 text-slate-400 hover:border-amber-400 hover:text-amber-400 transition-colors"
                aria-label="Siguiente"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
