import React, { useState, useEffect } from 'react'
import { getPortfolioContents, type PortfolioItem } from '../utils/portfolio'
import PortfolioCard from '../components/PortfolioCard'

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
          <PortfolioCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  )
}

export default Portfolio
