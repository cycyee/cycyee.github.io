import { motion } from 'framer-motion'
import type { Project } from '../data/projects'

interface Props {
  project: Project
  index: number
}

export function ProjectRow({ project, index }: Props) {
  return (
    <motion.div
      className="project-row"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <div>
        <div className="project-title">{project.title}</div>
        <div className="project-subtitle">{project.subtitle}</div>
        <p className="project-description">{project.description}</p>
        <div className="project-meta">
          <div className="project-tech">
            {project.tech.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          {(project.github || project.link) && (
            <div className="project-links">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              )}
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer">Live</a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
