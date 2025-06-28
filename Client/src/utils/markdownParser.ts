import { marked, type RendererObject, type Tokens } from 'marked'
import hljs from 'highlight.js'

const renderer: RendererObject = {

//重写 code 方法
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
}

marked.use({
  renderer,
  gfm: true,
  breaks: true,
  pedantic: false,
})

/**
 * @param markdownText Markdown 源文本
 * @returns 渲染后的 HTML 字符串
 */
export async function renderMarkdownToHtml(markdownText: string): Promise<string> {
  const rawHtml = await marked.parse(markdownText)
  return rawHtml
}
