
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Login from '@/views/login.vue'

// mock gsap，避免动画报错
vi.mock('gsap', () => ({
  gsap: {
    set: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
    })),
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

describe('login.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(Login, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false,
        })],
      },
    })
  })

  it('渲染登录表单（密码模式）', () => {
    expect(wrapper.find('.login-form').exists()).toBe(true)
    expect(wrapper.find('input#username').exists()).toBe(true)
    expect(wrapper.find('input#password').exists()).toBe(true)
    expect(wrapper.find('button.login-btn').exists()).toBe(true)
    // 默认是密码模式
    expect((wrapper.vm as any).loginMode).toBe('password')
  })

  it('切换到邮箱验证码模式', async () => {
    // 触发切换
    ;(wrapper.vm as any).loginMode = 'emailCode'
    await wrapper.vm.$nextTick()
    // 断言验证码输入框出现
    expect(wrapper.find('input#verificationCode').exists()).toBe(true)
    // 密码输入框消失
    expect(wrapper.find('input#password').exists()).toBe(false)
    expect((wrapper.vm as any).loginMode).toBe('emailCode')
  })

  it('输入用户名和密码并提交（密码模式）', async () => {
    const usernameInput = wrapper.find('input#username')
    const passwordInput = wrapper.find('input#password')
    await usernameInput.setValue('testuser')
    await passwordInput.setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    expect((usernameInput.element as HTMLInputElement).value).toBe('testuser')
    expect((passwordInput.element as HTMLInputElement).value).toBe('123456')
  })

  it('输入用户名和验证码并提交（邮箱验证码模式）', async () => {
    ;(wrapper.vm as any).loginMode = 'emailCode'
    await wrapper.vm.$nextTick()
    const usernameInput = wrapper.find('input#username')
    const codeInput = wrapper.find('input#verificationCode')
    await usernameInput.setValue('testuser')
    await codeInput.setValue('888888')
    await wrapper.find('form').trigger('submit.prevent')
    expect((usernameInput.element as HTMLInputElement).value).toBe('testuser')
    expect((codeInput.element as HTMLInputElement).value).toBe('888888')
  })

  it('记住我 checkbox 可用', async () => {
    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.exists()).toBe(true)
    expect((checkbox.element as HTMLInputElement).checked).toBe(false)
    await checkbox.setValue(true)
    expect((checkbox.element as HTMLInputElement).checked).toBe(true)
  })

  it('忘记密码链接存在', () => {
    const link = wrapper.find('.forgot-password')
    expect(link.exists()).toBe(true)
    expect(link.text()).toContain('忘记密码')
  })

  it('发送验证码按钮可用', async () => {
    ;(wrapper.vm as any).loginMode = 'emailCode'
    await wrapper.vm.$nextTick()
    const btn = wrapper.find('button.send-code-btn')
    expect(btn.exists()).toBe(true)
    expect(btn.attributes('disabled')).toBeUndefined()
    await btn.trigger('click')
    // 发送后按钮应禁用
    expect((wrapper.vm as any).isSendingCode).toBe(true)
  })
})
