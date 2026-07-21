export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  tech: string[]
  color: string
  link?: string
  github?: string
}

export const projects: Project[] = [
  {
    id: 'vertical',
    title: 'Vertical',
    subtitle: 'Agentic Video Generation',
    description:
      'Co-built a video generation platform with node-based workflows for iterative asset creation. Agents handle brainstorming, shot lists, scripts, and video synthesis via Gemini and Veo.',
    tech: ['React', 'Python', 'Gemini', 'Veo', 'Google Cloud', 'Supabase'],
    color: '#a855f7',
  },
  {
    id: 'stock-predictor',
    title: 'Stock Predictor',
    subtitle: 'Fourier + Prophet Forecasting',
    description:
      'Time-series forecasting tool combining Fourier transforms with Facebook Prophet for stock price prediction and trend analysis.',
    tech: ['Python', 'Prophet', 'NumPy', 'Matplotlib'],
    color: '#06b6d4',
  },
  {
    id: 'cpu',
    title: '15-Bit CPU',
    subtitle: 'Logisim Architecture',
    description:
      'Designed and built a 15-bit CPU from logic gates in Logisim, including ALU, register file, control unit, and instruction decoder.',
    tech: ['Logisim', 'Digital Logic', 'Assembly'],
    color: '#f59e0b',
  },
  {
    id: 'mapping',
    title: 'Campus Mapping',
    subtitle: 'Dijkstra Pathfinding',
    description:
      'Navigation tool parsing OpenStreetMap data for bike paths, bus routes, and walking paths. Dijkstra\'s algorithm finds optimal routes, accurate within 15% of Google Maps.',
    tech: ['C++', 'Expat', "Dijkstra's Algorithm"],
    color: '#10b981',
  },
]
