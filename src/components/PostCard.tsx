import React from 'react'
import { Link } from 'react-router-dom'
import type { BlogPost } from '../utils/blog'

interface PostCardProps {
  post: BlogPost
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
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
  )
}

export default PostCard
