
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

  it('渲染登录表单', () => {
    expect(wrapper.find('.login-form').exists()).toBe(true)
    expect(wrapper.find('input#username').exists()).toBe(true)
    expect(wrapper.find('input#password').exists()).toBe(true)
    expect(wrapper.find('button.login-btn').exists()).toBe(true)
  })

  it('输入用户名和密码并提交', async () => {
    const usernameInput = wrapper.find('input#username')
    const passwordInput = wrapper.find('input#password')
    await usernameInput.setValue('testuser')
    await passwordInput.setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    // 这里只能断言输入框内容
    expect((usernameInput.element as HTMLInputElement).value).toBe('testuser')
    expect((passwordInput.element as HTMLInputElement).value).toBe('123456')
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
})
