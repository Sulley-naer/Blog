
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PostList from '@/components/index/PostList.vue'

describe('PostList.vue', () => {
  it('渲染所有 PostCard', () => {
    const wrapper = mount(PostList, {
      props: { layout: 'grid' }
    })
    // 动态断言数量一致且大于0
    const postCards = wrapper.findAllComponents({ name: 'PostCard' })
    const cardEls = wrapper.findAll('.post-card')
    expect(postCards.length).toBe(cardEls.length)
    expect(postCards.length).toBeGreaterThan(0)
  })

  it('根据 layout prop 切换布局类', async () => {
    const wrapper = mount(PostList, {
      props: { layout: 'grid' }
    })
    expect(wrapper.find('.post-list').classes()).toContain('grid-layout')
    await wrapper.setProps({ layout: 'list' })
    expect(wrapper.find('.post-list').classes()).toContain('list-layout')
  })
})
