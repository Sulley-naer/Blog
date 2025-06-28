import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PostList from '../PostList.vue'

describe('PostList.vue', () => {
    it('renders the correct number of PostCard components', () => {
        const wrapper = mount(PostList)
        const postCards = wrapper.findAllComponents({ name: 'PostCard' })
        expect(postCards.length).toBe(3)
    })

    it('passes the correct post props to each PostCard', () => {
        const wrapper = mount(PostList)
        const postCards = wrapper.findAllComponents({ name: 'PostCard' })
        postCards.forEach((card, idx) => {
            expect(card.props('post').id).toBe(idx + 1)
            expect(card.props('post').title).toBe('Rolldown: 下一代前端构建工具')
            expect(card.props('post').tags).toEqual(['Vite', 'Rust', '前端'])
        })
    })

    it('renders post titles in the DOM', () => {
        const wrapper = mount(PostList)
        expect(wrapper.text()).toContain('Rolldown: 下一代前端构建工具')
    })

    it('has the correct root class', () => {
        const wrapper = mount(PostList)
        expect(wrapper.classes()).toContain('post-list')
    })
})
