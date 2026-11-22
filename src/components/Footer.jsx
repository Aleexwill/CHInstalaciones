import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-8 text-slate-400">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <Logo style={{ height: '40px' }} />
        <p>© {new Date().getFullYear()} CH Instalaciones Eléctricas. Todos los derechos reservados.</p>
        <p className="text-xs text-slate-600">Desarrollado por <span className="text-slate-400 font-medium">ALMN Projects</span></p>
      </div>
    </footer>
  )
}
