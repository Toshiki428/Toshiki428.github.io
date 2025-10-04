import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getBlogPost, type BlogPost as BlogPostType } from '../utils/Markdown'
import Mermaid from '../components/Mermaid'

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPostType | null>(null)

  useEffect(() => {
    if (slug) {
      const foundPost = getBlogPost(slug)
      setPost(foundPost)
    }
  }, [slug])

  if (!post) {
    return <div className="text-center p-8">Post not found!</div>
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <article className="prose lg:prose-lg mx-auto">
        <h1>{post.title}</h1>
        <div className="text-gray-600 text-sm mb-4">
          {new Date(post.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre: (props) => {
              const { node, children, ...rest } = props
              if (React.isValidElement(children)) {
                const childProps = children.props as { className?: string; children?: React.ReactNode }
                if (childProps.className === 'language-mermaid') {
                  const codeString = childProps.children
                  return (
                    <pre className="!bg-transparent">
                      <Mermaid chart={String(codeString).replace(/\n$/, '')} />
                    </pre>
                  )
                }
              }
              return <pre {...rest}>{children}</pre>
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>
    </div>
  )
}

export default BlogPost
