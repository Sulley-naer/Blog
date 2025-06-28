import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BackToTop from '../../index/BackToTop.vue'

describe('BackToTop.vue', () => {
  let appDiv: HTMLDivElement
  beforeEach(() => {
    appDiv = document.createElement('div')
    appDiv.id = 'app'
    appDiv.style.overflow = 'auto'
    appDiv.style.height = '500px'
    appDiv.style.maxHeight = '500px'
    appDiv.style.position = 'relative'
    document.body.appendChild(appDiv)
    ;(appDiv as unknown as { scrollTo: (..._args: unknown[]) => void }).scrollTo = (
      ..._args: unknown[]
    ) => {}
  })
  afterEach(() => {
    document.body.removeChild(appDiv)
  })

  it('初始时按钮不可见', () => {
    const wrapper = mount(BackToTop)
    expect(wrapper.find('.back-to-top').exists()).toBe(false)
  })

  it('滚动超过300px时按钮可见，点击后滚动到顶部', async () => {
    const wrapper = mount(BackToTop)
    appDiv.scrollTop = 350
    appDiv.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.back-to-top').exists()).toBe(true)

    const scrollToSpy = vi.spyOn(appDiv, 'scrollTo').mockImplementation(() => {})
    await wrapper.find('.back-to-top').trigger('click')
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    scrollToSpy.mockRestore()
  })

  it('滚动小于300px时按钮不可见', async () => {
    const wrapper = mount(BackToTop)
    appDiv.scrollTop = 100
    appDiv.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.back-to-top').exists()).toBe(false)
  })
})
