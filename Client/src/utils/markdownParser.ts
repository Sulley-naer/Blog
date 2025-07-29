import { marked, type RendererObject, type Tokens } from 'marked'
import hljs from 'highlight.js'

// 定义警告类型的映射
const alertTypes: { [key: string]: { title: string, className: string } } = {
  NOTE: { title: 'Note', className: 'note' },
  TIP: { title: 'Tip', className: 'tip' },
  IMPORTANT: { title: 'Important', className: 'important' },
  WARNING: { title: 'Warning', className: 'warning' },
  CAUTION: { title: 'Caution', className: 'caution' }
}

const renderer: RendererObject = {
  // 重写 code 方法
  code(token: Tokens.Code): string {
    const code = token.text
    const lang = token.lang

    // 检查语言是否有效
    const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'

    // 使用 highlight 高亮代码
    const highlightedCode = hljs.highlight(code, {
      language,
      ignoreIllegals: true,
    }).value

    return `<pre><code class="hljs language-${language}">${highlightedCode}</code></pre>`
  },

  // 重写 blockquote 方法以支持 GitHub 风格的警告标签
  blockquote(token: Tokens.Blockquote): string {
    // 获取 blockquote 的文本内容
    const text = token.tokens.map(t => t.raw).join('')
    
    // 检查是否是警告标签格式: > [!TYPE]
    const alertRegex = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)/i
    const match = text.match(alertRegex)
    
    if (match) {
      // 提取警告类型和内容
      const alertType = match[1].toUpperCase()
      const content = match[2]
      
      // 获取警告类型信息
      const alertInfo = alertTypes[alertType]
      if (alertInfo) {
        // 渲染警告内容（移除第一行警告标签）
        const lines = text.split('\n')
        const contentLines = lines.slice(1).filter(line => line.trim() !== '')
        const contentText = contentLines.join('\n')
        
        // 使用 marked 解析内容中的 Markdown 语法
        const parsedContent = marked.parse(contentText || content)
        
        // 返回自定义警告框 HTML
        return `
          <div class="markdown-alert markdown-alert-${alertInfo.className}">
            <p class="markdown-alert-title">${alertInfo.title}</p>
            <div class="markdown-alert-content">${parsedContent}</div>
          </div>
        `
      }
    }
    
    // 如果不是警告标签，使用默认渲染
    return `<blockquote>${marked.parseInline(text)}</blockquote>`
  }
}

marked.use({
  renderer,
  gfm: true,
  breaks: true,
  pedantic: false,
})

/**
 * 将 Markdown 文本渲染为 HTML
 * @param markdownText Markdown 源文本
 * @returns 渲染后的 HTML 字符串
 */
export async function renderMarkdownToHtml(markdownText: string): Promise<string> {
  const rawHtml = marked.parse(markdownText)
  return rawHtml
}
