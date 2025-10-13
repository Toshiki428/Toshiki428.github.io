import React, { useState, useEffect } from 'react'
import { getBlogPosts, type BlogPost } from '../utils/blog'
import PostCard from '../components/PostCard'

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
                  <PostCard key={post.slug} post={post} />
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
