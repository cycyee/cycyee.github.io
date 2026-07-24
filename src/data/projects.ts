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
    subtitle: 'Agentic Video Generation · private',
    description:
      'Co-built a video generation platform with node-based workflows for iterative asset creation. Agents handle brainstorming, shot lists, scripts, and video synthesis via Gemini and Veo. Currently in acquisition discussions.',
    tech: ['React', 'TypeScript', 'Python', 'Gemini', 'Veo', 'Supabase'],
    color: '#a855f7',
  },
  {
    id: 'stock-predictor',
    title: 'Stock Predictor',
    subtitle: 'Fourier + Prophet Forecasting',
    description:
      'FFT decomposes detrended prices into dominant cycles with adjustable harmonics. Extrapolates forward alongside Prophet, with backtest comparison on MAE/RMSE.',
    tech: ['Python', 'NumPy', 'Prophet', 'Streamlit', 'Plotly'],
    color: '#06b6d4',
    github: 'https://github.com/cycyee/Stock-Predictor-App',
  },
  {
    id: 'cpu',
    title: '15-Bit CPU',
    subtitle: 'Logisim Architecture',
    description:
      'Designed and built a 15-bit CPU from logic gates in Logisim, including ALU, register file, control unit, and instruction decoder.',
    tech: ['Logisim', 'Digital Logic', 'Assembly'],
    color: '#f59e0b',
    github: 'https://github.com/cycyee/CPU',
  },
  {
    id: 'mapping',
    title: 'Campus Mapping',
    subtitle: 'Dijkstra Pathfinding',
    description:
      'Navigation tool parsing OpenStreetMap data for bike paths, bus routes, and walking paths. Dijkstra\'s algorithm finds optimal routes, accurate within 15% of Google Maps.',
    tech: ['C++', 'Expat', "Dijkstra's Algorithm"],
    color: '#10b981',
    github: 'https://github.com/cycyee/Map-Program',
  },
]
