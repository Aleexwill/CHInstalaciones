import { useState, useEffect, useCallback, useRef } from 'react'
import { useCarousel } from '../hooks/useCarousel'
import { useReducedMotion } from '../hooks/useReducedMotion'

const FALLBACK_SLIDES = [
  {
    id: 'f1',
    image: '',
    gradient: 'from-slate-900 via-slate-800 to-slate-950',
    title: 'Instalaciones eléctricas seguras y confiables',
    subtitle: 'Soluciones para hogares, comercios e industrias',
  },
]

const INTERVAL = 5000


export default function Carousel() {
  const { slides, loading } = useCarousel({ onlyActive: true })
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const reducedMotion = useReducedMotion()

  const activeSlides = slides.length > 0 ? slides : FALLBACK_SLIDES

  const next = useCallback(() => setCurrent((c) => (c + 1) % activeSlides.length), [activeSlides.length])
  const prev = () => setCurrent((c) => (c - 1 + activeSlides.length) % activeSlides.length)

  useEffect(() => {
    if (paused || reducedMotion || activeSlides.length <= 1) return
    const t = setInterval(next, INTERVAL)
    return () => clearInterval(t)
  }, [next, paused, reducedMotion, activeSlides.length])

  useEffect(() => { setCurrent(0) }, [slides.length])

  const slide = activeSlides[current]

  return (
    <section
      id="top"
      className="relative h-[90vh] min-h-[600px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fondo base siempre visible para evitar parpadeo */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* Slides — se montan cuando llegan las imágenes */}
      <div className="absolute inset-0">
        {activeSlides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {s.image ? (
              <img
                src={s.image}
                alt={s.title || ''}
                className="h-full w-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'low'}
              />
            ) : (
              <div className={`h-full w-full bg-gradient-to-br ${s.gradient || 'from-slate-900 to-slate-950'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-slate-950/30" />
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.08),transparent_60%)]" />

      {/* Content */}
      <div className="relative z-30 flex h-full items-center">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="max-w-3xl">
            <span
              className="hero-enter inline-flex items-center gap-2 rounded-full bg-amber-400/10 border border-amber-400/40 px-4 py-1.5 text-sm font-semibold text-amber-300 mb-6 uppercase tracking-widest"
              style={{ animationDelay: '0.2s' }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
              Electricistas certificados
            </span>

            <h1
              className="hero-enter font-display text-5xl md:text-6xl lg:text-8xl font-bold uppercase leading-none text-white"
              style={{ animationDelay: '0.35s' }}
            >
              Instalaciones{' '}
              <span className="text-amber-400 italic">eléctricas</span>
              <br />seguras y confiables
            </h1>

            <p
              className="hero-enter mt-6 text-base md:text-lg text-slate-300 max-w-xl"
              style={{ animationDelay: '0.5s' }}
            >
              Soluciones para hogares, comercios e industrias.
              Calidad, seguridad y cumplimiento normativo en cada trabajo.
            </p>

            <div
              className="hero-enter mt-8 flex flex-wrap gap-4"
              style={{ animationDelay: '0.65s' }}
            >
              <a
                href="#contacto"
                className="rounded-md bg-amber-400 px-7 py-3.5 font-bold font-display text-lg uppercase tracking-wide text-slate-950 hover:bg-amber-300 transition-colors"
              >
                Solicitar presupuesto
              </a>
              <a
                href="#servicios"
                className="rounded-md border border-white/30 px-7 py-3.5 font-semibold text-slate-200 hover:border-amber-400 hover:text-amber-300 transition-colors backdrop-blur-sm"
              >
                Ver servicios
              </a>
            </div>

            <div
              className="hero-enter mt-12 flex flex-wrap gap-8"
              style={{ animationDelay: '0.8s' }}
            >
              {[
                { num: '+500', label: 'Proyectos realizados' },
                { num: '100%', label: 'Garantía por escrito' },
                { num: '24h',  label: 'Respuesta rápida' },
              ].map(({ num, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="font-display text-3xl font-bold text-amber-400 leading-none">{num}</span>
                  <span className="mt-1 text-xs text-slate-400 uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Arrows — solo si hay más de 1 slide */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-3 text-white backdrop-blur hover:bg-black/50 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-3 text-white backdrop-blur hover:bg-black/50 transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight />
          </button>
        </>
      )}

      {/* Dots — área táctil 44px, punto visual pequeño */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="flex h-11 w-11 items-center justify-center"
              aria-label={`Slide ${i + 1}`}
              aria-current={i === current ? 'true' : undefined}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 h-2 bg-amber-400' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function ChevronLeft() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  )
}
function ChevronRight() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  )
}
