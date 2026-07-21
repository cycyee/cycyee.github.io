import { projects } from '../data/projects'
import { ProjectRow } from './ProjectRow'

export function Projects() {
  return (
    <section className="projects">
      <p className="projects-label">Projects</p>
      <div className="project-list">
        {projects.map((project, i) => (
          <ProjectRow key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
