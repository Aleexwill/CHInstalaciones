import { useState } from 'react'
import Logo from './Logo'

const LINKS = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#hogar', label: 'Hogar' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800">
      <nav className="mx-auto max-w-6xl px-6 flex items-center justify-between h-20">
        <a href="#top" className="flex items-center" aria-label="CH Instalaciones Eléctricas - Inicio">
          <Logo />
        </a>

        <ul className="hidden md:flex items-center gap-8 text-base text-slate-300">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-amber-400 transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contacto"
          className="hidden md:inline-flex items-center rounded-md bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
        >
          Pedir presupuesto
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-slate-200"
          aria-label="Abrir menú"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-6 py-4">
          <ul className="flex flex-col gap-4 text-slate-300">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)} className="hover:text-amber-400">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contacto"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            Pedir presupuesto
          </a>
        </div>
      )}
    </header>
  )
}
