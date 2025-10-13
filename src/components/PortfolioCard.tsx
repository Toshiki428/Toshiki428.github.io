import React from 'react'
import type { PortfolioItem } from '../utils/portfolio'

interface PortfolioCardProps {
  item: PortfolioItem
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item }) => {
  return (
    <div
      key={item.slug}
      className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300"
    >
      <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">{item.title}</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full"
            >
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
  )
}

export default PortfolioCard
