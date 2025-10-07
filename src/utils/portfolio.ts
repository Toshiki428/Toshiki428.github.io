import matter from 'gray-matter'
import { markdownFiles } from './Markdown'

export interface PortfolioItem {
    slug: string
    title: string
    tags: string[]
    imageUrl: string
    repoUrl: string
    content: string
}

export const getPortfolioContents = (): PortfolioItem[] => {
    const portfolioItems: PortfolioItem[] = []

    for (const path in markdownFiles) {
        if (path.startsWith('../contents/portfolio/')) {
            const rawContent = markdownFiles[path]
            const { data, content } = matter(rawContent)
            
            const slug = path.replace('../contents/portfolio/', '').replace('.md', '')

            portfolioItems.push({
                slug: slug,
                title: data.title || 'No Title',
                tags: data.tags || [],
                imageUrl: data.imageUrl || '',
                repoUrl: data.repoUrl || '',
                content: content.trim(),
            })
        }
    }
    return portfolioItems
}
