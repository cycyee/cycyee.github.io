import { motion } from 'framer-motion'

export function About() {
  return (
    <motion.section
      className="about"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
    >
      <p className="about-label">About</p>
      <p className="about-text">
        I work on the Platform team at Apex Fintech, building CI and build
        infrastructure, developer tooling, and backend services for a large
        monorepo. Day to day that means Go, distributed systems, and AI
        developer tooling &mdash; I took an internal AI agent platform from a
        hackathon prototype to production.
      </p>
      <p className="about-text">
        Outside of work: drawing, sculpture, mountain biking, and backpacking.
      </p>
    </motion.section>
  )
}
