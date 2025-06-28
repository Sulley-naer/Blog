import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import { createRouter, createWebHistory } from 'vue-router'
import PostDetail from '@/views/post/PostDetail.vue'

// Mock renderMarkdownToHtml
vi.mock('@/utils/markdownParser', () => ({
  renderMarkdownToHtml: vi.fn(() => Promise.resolve('<h1>Title</h1><p>Content</p>')),
}))

const mockMarkdown = '# Title\nContent'

describe('PostDetail.vue', () => {
  let router: ReturnType<typeof createRouter>
  beforeEach(() => {
    vi.resetAllMocks()
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/post/:id', name: 'post', component: PostDetail },
      ],
    })
  })

  function customRender() {
    return render(PostDetail, {
      global: {
        plugins: [router],
      },
    })
  }

  it('renders loading state initially', async () => {
    globalThis.fetch = vi.fn(() => new Promise<Response>(() => {})) as unknown as typeof fetch
    customRender()
    expect(screen.getByText('正在加载文章...')).toBeTruthy()
  })

  it('renders markdown content after fetch', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockMarkdown),
    })
    customRender()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Title' })).toBeTruthy()
      expect(screen.getByText('Content')).toBeTruthy()
    })
  })

  it('shows error if fetch fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    })
    customRender()
    await waitFor(() => {
      expect(screen.getAllByText('文章加载失败').length).toBeGreaterThan(0)
      expect(screen.getByText(/无法获取 Markdown 文件/)).toBeTruthy()
    })
  })

  it('shows error if fetch throws', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
    customRender()
    await waitFor(() => {
      expect(screen.getAllByText('文章加载失败').length).toBeGreaterThan(0)
      expect(screen.getByText('Network error')).toBeTruthy()
    })
  })

  it('renders back link to home', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockMarkdown),
    })
    customRender()
    await waitFor(() => {
      expect(screen.getAllByText('← 返回首页').length).toBeGreaterThan(0)
    })
  })
})
