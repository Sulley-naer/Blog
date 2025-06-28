import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ViewOptions from './../../index/ViewOptions.vue'


describe('ViewOptions.vue', () => {
  it('初始渲染正确，默认选中近期更新和列表布局', () => {
    const wrapper = mount(ViewOptions)
    // 检查视图类型按钮
    const typeBtns = wrapper.findAll('.option-button')
    expect(typeBtns.length).toBe(3)
    expect(typeBtns[0].classes()).toContain('active')
    expect(typeBtns[0].text()).toBe('近期更新')
    // 检查布局按钮
    const layoutBtns = wrapper.findAll('.layout-button')
    expect(layoutBtns.length).toBe(2)
    expect(layoutBtns[0].classes()).toContain('active')
    expect(layoutBtns[1].classes()).not.toContain('active')
  })

  it('点击视图类型按钮切换高亮', async () => {
    const wrapper = mount(ViewOptions)
    const typeBtns = wrapper.findAll('.option-button')
    await typeBtns[1].trigger('click')
    expect(typeBtns[1].classes()).toContain('active')
    expect(typeBtns[0].classes()).not.toContain('active')
  })

  it('点击布局按钮切换高亮并触发事件', async () => {
    const emitSpy = vi.fn()
    const wrapper = mount(ViewOptions, {
      attrs: {
        'onUpdate:layout': emitSpy
      }
    })
    const layoutBtns = wrapper.findAll('.layout-button')
    await layoutBtns[1].trigger('click')
    expect(layoutBtns[1].classes()).toContain('active')
    expect(layoutBtns[0].classes()).not.toContain('active')
    expect(emitSpy).toHaveBeenCalledWith('grid')
  })
})
