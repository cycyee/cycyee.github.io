import { useEffect, useRef } from 'react'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Projects } from './components/Projects'
import { SceneCanvas } from './components/SceneCanvas'

export interface GlassRect {
  top: number
  left: number
  width: number
  height: number
}

export default function App() {
  const glassRef = useRef<GlassRect | null>(null)

  useEffect(() => {
    const measure = () => {
      const list = document.querySelector('.project-list')
      if (!list) return
      const r = list.getBoundingClientRect()
      glassRef.current = {
        top: r.top + window.scrollY,
        left: r.left,
        width: r.width,
        height: r.height,
      }
    }

    measure()
    window.addEventListener('resize', measure)
    const observer = new MutationObserver(measure)
    observer.observe(document.body, { childList: true, subtree: true })
    setTimeout(measure, 500)

    return () => {
      window.removeEventListener('resize', measure)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <SceneCanvas glassRef={glassRef} />
      <main>
        <Hero />
        <About />
        <Projects />
      </main>
    </>
  )
}
