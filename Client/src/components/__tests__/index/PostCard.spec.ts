import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import PostCard from './../../index/PostCard.vue'

const post = {
    id: 1,
    title: 'Test Title',
    date: '2024-06-01',
    snippet: 'This is a test snippet.',
    tags: ['vue', 'test', 'blog']
}

describe('PostCard', () => {
    it('renders post title', () => {
        const wrapper = mount(PostCard, {
            props: { post },
            global: { stubs: { RouterLink: RouterLinkStub } }
        })
        expect(wrapper.find('.post-title').text()).toBe(post.title)
    })

    it('renders post date', () => {
        const wrapper = mount(PostCard, {
            props: { post },
            global: { stubs: { RouterLink: RouterLinkStub } }
        })
        expect(wrapper.find('.post-date').text()).toBe(post.date)
    })

    it('renders post snippet', () => {
        const wrapper = mount(PostCard, {
            props: { post },
            global: { stubs: { RouterLink: RouterLinkStub } }
        })
        expect(wrapper.find('.post-snippet').text()).toBe(post.snippet)
    })

    it('renders all tags', () => {
        const wrapper = mount(PostCard, {
            props: { post },
            global: { stubs: { RouterLink: RouterLinkStub } }
        })
        const tags = wrapper.findAll('.tag')
        expect(tags).toHaveLength(post.tags.length)
        post.tags.forEach((tag, i) => {
            expect(tags[i].text()).toBe(`#${tag}`)
        })
    })

    it('renders router-link with correct path', () => {
        const wrapper = mount(PostCard, {
            props: { post },
            global: { stubs: { RouterLink: RouterLinkStub } }
        })
        const link = wrapper.findComponent(RouterLinkStub)
        expect(link.exists()).toBe(true)
        expect(link.props('to')).toBe('/post/PostDetail')
    })

    it('renders "阅读全文 →" text in router-link', () => {
        const wrapper = mount(PostCard, {
            props: { post },
            global: { stubs: { RouterLink: RouterLinkStub } }
        })
        const link = wrapper.findComponent(RouterLinkStub)
        expect(link.text()).toContain('阅读全文')
    })
})
