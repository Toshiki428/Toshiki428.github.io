import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getMarkdownContent } from '../utils/Markdown';

const About: React.FC = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    const aboutMeContent = getMarkdownContent('pages', 'about.md');
    setMarkdown(aboutMeContent);
  }, []);

  return (
    <div className="prose lg:prose-lg mx-auto p-8">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
};

export default About;
