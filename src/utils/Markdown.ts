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

export interface BlogPost {
    slug: string
    title: string
    date: string
    tags: string[]
    content: string
}

export const getBlogPosts = (): BlogPost[] => {
    const posts: BlogPost[] = []

    for (const path in markdownFiles) {
        if (path.startsWith('../contents/blog/')) {
            const rawContent = markdownFiles[path]
            const { data, content } = matter(rawContent)
            const slug = path.replace('../contents/blog/', '').replace('.md', '')

            posts.push({
                slug,
                title: data.title || 'No Title',
                date: data.date || '1970-01-01',
                tags: data.tags || [],
                content: content.trim(),
            })
        }
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const getBlogPost = (slug: string): BlogPost | null => {
    const filePath = `../contents/blog/${slug}.md`
    const rawContent = markdownFiles[filePath]

    if (!rawContent) {
        return null
    }

    const { data, content } = matter(rawContent)

    return {
        slug,
        title: data.title || 'No Title',
        date: data.date || '1970-01-01',
        tags: data.tags || [],
        content: content.trim(),
    }
}
