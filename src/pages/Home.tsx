import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getMarkdownContent } from '../utils/Markdown'

const Home: React.FC = () => {
  const [markdown, setMarkdown] = useState('')

  useEffect(() => {
    const aboutMeContent = getMarkdownContent('pages', 'about.md')
    setMarkdown(aboutMeContent)
  }, [])

  return (
    <article className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  )
}

export default Home
