import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBlogPosts, type BlogPost } from '../utils/Markdown'

const Blog: React.FC = () => {
  const [groupedPosts, setGroupedPosts] = useState<Record<string, BlogPost[]>>({})
  const [sortedCategories, setSortedCategories] = useState<string[]>([])

  useEffect(() => {
    const allPosts = getBlogPosts()
    const groups = allPosts.reduce<Record<string, BlogPost[]>>((acc, post) => {
      const { displayName } = post.category
      if (!acc[displayName]) {
        acc[displayName] = []
      }
      acc[displayName].push(post)
      return acc
    }, {})
    setGroupedPosts(groups)

    const sorted = Object.keys(groups).sort((a, b) => {
      const orderA = groups[a][0].category.order
      const orderB = groups[b][0].category.order
      return orderA - orderB
    })
    setSortedCategories(sorted)
  }, [])

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-center mb-12">Blog</h1>
      <div className="space-y-12">
        {sortedCategories.map((category) => {
          const posts = groupedPosts[category]
          if (!posts || posts.length === 0) {
            return null
          }
          return (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-6 border-b-2 border-gray-200 pb-2">{category}</h2>
              <div className="space-y-8">
                {posts.map((post) => (
                  <div key={post.slug} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-2">
                      <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                        {post.title}
                      </Link>
                    </h3>
                    <div className="text-gray-600 text-sm mb-4">
                      {new Date(post.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Blog
