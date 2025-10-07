import matter from 'gray-matter'
import { categories, UNCLASSIFIED_CATEGORY, type CategoryID } from '../constants/categories'
import { markdownFiles } from './Markdown'

export interface BlogPost {
    slug: string
    title: string
    date: string
    tags: string[]
    content: string
    category: {
        id: CategoryID | 'UNCLASSIFIED'
        displayName: string
        order: number
    }
}

const isValidCategoryID = (id: any): id is CategoryID => {
    return id in categories
}

export const getBlogPosts = (): BlogPost[] => {
    const posts: BlogPost[] = []

    for (const path in markdownFiles) {
        if (path.startsWith('../contents/blog/')) {
            const rawContent = markdownFiles[path]
            const { data, content } = matter(rawContent)
            const slug = path.replace('../contents/blog/', '').replace('.md', '')

            const categoryId = data.category
            const isValid = isValidCategoryID(categoryId)

            const categoryInfo = isValid ? categories[categoryId] : UNCLASSIFIED_CATEGORY
            const id: CategoryID | 'UNCLASSIFIED' = isValid ? categoryId : 'UNCLASSIFIED'

            const category = {
                id,
                ...categoryInfo
            }

            posts.push({
                slug,
                title: data.title || 'No Title',
                date: data.date || '1970-01-01',
                tags: data.tags || [],
                content: content.trim(),
                category,
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
    const categoryId = data.category
    const isValid = isValidCategoryID(categoryId)

    const categoryInfo = isValid ? categories[categoryId] : UNCLASSIFIED_CATEGORY
    const id: CategoryID | 'UNCLASSIFIED' = isValid ? categoryId : 'UNCLASSIFIED'

    const category = {
        id,
        ...categoryInfo
    }

    return {
        slug,
        title: data.title || 'No Title',
        date: data.date || '1970-01-01',
        tags: data.tags || [],
        content: content.trim(),
        category,
    }
}
