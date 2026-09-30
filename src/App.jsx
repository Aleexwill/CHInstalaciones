import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import Navbar from './components/Navbar'
import Carousel from './components/Carousel'
import Services from './components/Services'
import Promos from './components/Promos'
import SolucionesHogar from './components/SolucionesHogar'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminLogin from './components/admin/AdminLogin'
import AdminProjects from './components/admin/AdminProjects'
import AdminCarousel from './components/admin/AdminCarousel'

const isAdminRoute =
  window.location.hash.startsWith('#admin') ||
  window.location.pathname.startsWith('/admin')

function App() {
  // Start from cached user so the admin panel opens instantly on repeat visits
  const [user, setUser] = useState(isAdminRoute ? (auth.currentUser ?? undefined) : null)
  const [adminTab, setAdminTab] = useState('proyectos')

  useEffect(() => {
    if (!isAdminRoute) return
    return onAuthStateChanged(auth, setUser)
  }, [])

  if (isAdminRoute) {
    if (user === undefined) return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-amber-400" />
          <span className="text-sm text-slate-500">Verificando sesión…</span>
        </div>
      </div>
    )
    if (!user) return <AdminLogin />
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Admin header with tabs */}
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-16">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-amber-400 text-slate-950 font-bold text-sm">⚡</span>
              <span className="text-sm font-semibold">Panel Admin</span>
            </div>
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setAdminTab('proyectos')}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${adminTab === 'proyectos' ? 'bg-amber-400/10 text-amber-400' : 'text-slate-400 hover:text-white'}`}
              >
                Proyectos
              </button>
              <button
                onClick={() => setAdminTab('carrusel')}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${adminTab === 'carrusel' ? 'bg-amber-400/10 text-amber-400' : 'text-slate-400 hover:text-white'}`}
              >
                Carrusel
              </button>
            </nav>
            <div className="flex items-center gap-3">
              <a href="/" className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-500 hover:text-white transition-colors">
                Ver sitio →
              </a>
              <button
                onClick={() => signOut(auth)}
                className="rounded-md px-3 py-1.5 text-xs text-slate-500 hover:text-white transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl">
          {adminTab === 'proyectos' ? <AdminProjects /> : <AdminCarousel />}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Carousel />
      <Services />
      <Promos />
      <SolucionesHogar />
      <About />
      <Projects />
      <Contact />
      <Footer />

      {/* Botón flotante WhatsApp */}
      <a
        href="https://wa.me/595984480486"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-200"
      >
        <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}

export default App
