import matter from 'gray-matter'

const markdownFiles = import.meta.glob('../contents/**/*.md', {
    eager: true,
    as: 'raw'
})

export const getMarkdownContent = (type: string, fileName: string): string => {
    const filePath = `../contents/${type}/${fileName}`
    const markdown = markdownFiles[filePath]
    if (typeof markdown !== 'string') {
        console.warn(`Markdown file not found: ${type}/${fileName}`)
        return ''
    }
    return markdown
}

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
