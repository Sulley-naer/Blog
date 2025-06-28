import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroSection from '../HeroSection.vue'

describe('HeroSection', () => {
    it('renders the hero section', () => {
        const wrapper = mount(HeroSection)
        expect(wrapper.find('section.hero-section').exists()).toBe(true)
    })

    it('renders the correct title', () => {
        const wrapper = mount(HeroSection)
        expect(wrapper.find('.hero-title').text()).toBe('探索、创造、分享')
    })

    it('renders the correct subtitle', () => {
        const wrapper = mount(HeroSection)
        expect(wrapper.find('.hero-subtitle').text()).toBe('一个记录技术思考与生活灵感的空间。')
    })

    it('matches snapshot', () => {
        const wrapper = mount(HeroSection)
        expect(wrapper.html()).toMatchSnapshot()
    })
})
