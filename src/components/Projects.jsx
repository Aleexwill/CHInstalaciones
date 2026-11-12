import { useProjects } from '../hooks/useProjects'

const FALLBACK_GRADIENTS = [
  'from-slate-700 to-slate-900',
  'from-amber-600 to-slate-900',
  'from-slate-600 to-slate-900',
  'from-slate-800 to-slate-950',
  'from-amber-700 to-slate-900',
  'from-slate-700 to-slate-950',
]

export default function Projects() {
  const { projects, loading } = useProjects({ onlyActive: true })

  return (
    <section id="proyectos" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-amber-600 mb-3 block">
            Proyectos
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-bold uppercase leading-none text-slate-900">
            Trabajos que{' '}
            <span className="text-amber-500 italic">hablan</span> por nosotros
          </h2>
          <p className="mt-5 text-slate-600">
            Una muestra de las instalaciones que realizamos para clientes residenciales,
            comerciales e industriales.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-xl bg-slate-100" />
            ))
          ) : projects.length === 0 ? (
            <p className="col-span-3 text-center text-slate-400 py-12">
              Los proyectos se cargarán en breve.
            </p>
          ) : (
            projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} gradient={FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length]} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, gradient }) {
  return (
    <article
      tabIndex="0"
      className={`group relative h-56 overflow-hidden rounded-xl flex flex-col justify-end focus:outline-2 focus:outline-amber-400 focus:outline-offset-2 ${project.image ? '' : `bg-gradient-to-br ${gradient}`}`}
    >
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

      {/* Badge */}
      <span className="absolute top-4 left-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
        {project.category}
      </span>

      {project.isFeatured && (
        <span className="absolute top-4 right-4 rounded-full bg-amber-400/90 px-3 py-1 text-xs font-semibold text-slate-950">
          Destacado
        </span>
      )}

      {/* Content */}
      <div className="relative p-5">
        <h3 className="text-base font-semibold text-white">{project.title}</h3>
        {project.description && (
          <p className="mt-1 text-xs text-slate-300 line-clamp-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
            {project.description}
          </p>
        )}
        <div className="mt-1 flex gap-3 text-xs text-slate-400">
          {project.client && <span>{project.client}</span>}
          {project.year && <span>{project.year}</span>}
          {project.location && <span>{project.location}</span>}
        </div>
      </div>
    </article>
  )
}
