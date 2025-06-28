// src/views/__tests__/HomePage.spec.ts
import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import HomePage from '@/views/index.vue' // 确保路径正确

// 模拟子组件（关键：类名与测试选择器一致）
const HeroSectionStub = {
  template: '<div class="hero-section-stub"></div>',
  name: 'HeroSection',
}
const PostListStub = {
  template: '<div class="post-list-stub"></div>',
  name: 'PostList',
}
const AppFooterStub = {
  template: '<div class="app-footer-stub"></div>',
  name: 'AppFooter',
}

describe('HomePage', () => {
  it('正确渲染所有子组件', async () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          HeroSection: HeroSectionStub,
          PostList: PostListStub,
          AppFooter: AppFooterStub,
        },
      },
    })

    await flushPromises()
    expect(wrapper.find('.hero-section-stub').exists()).toBe(true)
    expect(wrapper.find('.post-list-stub').exists()).toBe(true)
    expect(wrapper.find('.app-footer-stub').exists()).toBe(true)
  })
})
