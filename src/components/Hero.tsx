import { motion } from 'framer-motion'

export function Hero() {
  return (
    <motion.section
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1>Calvin Yee</h1>
      <p className="hero-sub">
        Software engineer building things at Apex Fintech Solutions.
        UC Davis CS, class of 2025.
      </p>
      <nav className="hero-links">
        <a href="https://github.com/cycyee" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="https://linkedin.com/in/calvinyee" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href="/assets/resume.pdf" target="_blank" rel="noopener noreferrer">
          Resume
        </a>
      </nav>
    </motion.section>
  )
}
