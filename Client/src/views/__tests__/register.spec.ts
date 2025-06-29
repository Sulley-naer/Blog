import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Register from '../register.vue'

// mock gsap，避免动画报错
vi.mock('gsap', () => ({
  gsap: {
    set: vi.fn(),
    from: vi.fn(),
    fromTo: vi.fn(),
    to: vi.fn(),
  },
}))
// mock useAuroraBackground 和 useMouseTrail，避免 canvas 依赖报错
vi.mock('@/myCanvasJs/useAuroraBackground', () => ({
  useAuroraBackground: vi.fn(),
}))
vi.mock('@/myCanvasJs/useMouseTrail', () => ({
  useMouseTrail: vi.fn(),
}))

describe('register.vue', () => {
  let wrapper: ReturnType<typeof mount>
  beforeEach(() => {
    wrapper = mount(Register, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false,
        })],
        stubs: ['FormError', 'Transition'],
      },
    })
  })

  it('渲染注册表单第一步', () => {
    expect(wrapper.find('.register-form').exists()).toBe(true)
    expect(wrapper.find('input#username').exists()).toBe(true)
    expect(wrapper.find('input#email').exists()).toBe(true)
    expect(wrapper.find('input#verificationCode').exists()).toBe(true)
    expect(wrapper.find('button.send-code-btn').exists()).toBe(true)
    expect(wrapper.find('button.action-btn span').text()).toContain('下一步')
  })

  it('点击发送验证码按钮后倒计时', async () => {
    const btn = wrapper.find('button.send-code-btn')
    expect(btn.attributes('disabled')).toBeUndefined()
    await btn.trigger('click')
    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('输入用户名、邮箱、验证码并进入第二步', async () => {
    await wrapper.find('input#username').setValue('testuser')
    await wrapper.find('input#email').setValue('test@mail.com')
    await wrapper.find('input#verificationCode').setValue('123456')
    await wrapper.find('form.step-form').trigger('submit.prevent')
    // registrationStep 变为 2，step-two 显示
    expect((wrapper.vm as any).registrationStep).toBe(2)
  })

  it('第二步渲染密码输入', async () => {
    // 直接设置 registrationStep
    (wrapper.vm as any).registrationStep = 2
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input#password').exists()).toBe(true)
    expect(wrapper.find('input#confirmPassword').exists()).toBe(true)
    expect(wrapper.findAll('button.action-btn').length).toBeGreaterThanOrEqual(1)
  })

  it('密码校验不通过时显示错误提示', async () => {
    (wrapper.vm as any).registrationStep = 2
    await wrapper.find('input#password').setValue('123')
    await wrapper.find('input#confirmPassword').setValue('123')
    await wrapper.find('form.step-form').trigger('submit.prevent')
    expect((wrapper.vm as any).passwordError).not.toBe('')
  })

  it('两次密码不一致时显示错误提示', async () => {
    (wrapper.vm as any).registrationStep = 2
    await wrapper.find('input#password').setValue('12345678a')
    await wrapper.find('input#confirmPassword').setValue('87654321a')
    await wrapper.find('form.step-form').trigger('submit.prevent')
    expect((wrapper.vm as any).confirmPasswordError).not.toBe('')
  })

  it('点击上一步按钮返回第一步', async () => {
    (wrapper.vm as any).registrationStep = 2
    await wrapper.vm.$nextTick()
    await wrapper.find('button.secondary-btn').trigger('click')
    expect((wrapper.vm as any).registrationStep).toBe(1)
  })
})
