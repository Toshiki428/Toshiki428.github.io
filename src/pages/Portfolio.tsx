import React, { useState, useEffect } from 'react'
import { getPortfolioContents, type PortfolioItem } from '../utils/portfolio'

const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([])

  useEffect(() => {
    const portfolioItems = getPortfolioContents()
    setItems(portfolioItems)
  }, [])

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item.slug} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                  <span key={tag} className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-700 mb-4">{item.content}</p>
              <a href={item.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                View Repository
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Portfolio
