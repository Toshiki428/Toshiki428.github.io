import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBlogPosts, type BlogPost } from '../utils/Markdown'

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const allPosts = getBlogPosts()
    setPosts(allPosts)
  }, [])

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Blog</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <div key={post.slug} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-2">
              <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                {post.title}
              </Link>
            </h2>
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
}

export default Blog
