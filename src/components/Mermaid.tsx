import React, { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

type Props = {
  chart: string
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'forest',
})

const Mermaid: React.FC<Props> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderMermaid = async () => {
      if (containerRef.current && chart) {
        try {
          const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`
          const { svg } = await mermaid.render(id, chart)
          if (containerRef.current) {
            containerRef.current.innerHTML = svg
          }
        } catch (error) {
          console.error('Failed to render mermaid chart:', error)
          if (containerRef.current) {
            containerRef.current.innerText = chart
          }
        }
      }
    }
    renderMermaid()
  }, [chart])

  return <div ref={containerRef} className="mermaid-container flex justify-center" />
}

export default Mermaid
