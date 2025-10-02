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
