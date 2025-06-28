import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFooter from '../AppFooter.vue'

describe('AppFooter', () => {
    it('renders footer element', () => {
        const wrapper = mount(AppFooter)
        expect(wrapper.find('footer.app-footer').exists()).toBe(true)
    })

    it('renders copyright text', () => {
        const wrapper = mount(AppFooter)
        expect(wrapper.text()).toContain('© 2025 MyBlog.')
    })

    it('has correct class on footer', () => {
        const wrapper = mount(AppFooter)
        expect(wrapper.find('footer').classes()).toContain('app-footer')
    })
})
