// src/views/__tests__/login.spec.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import LoginPage from '@/views/login.vue'

// GSAP 的模拟仍然是需要的，因为 onMounted 中会调用它
vi.mock('gsap', () => {
  const mockTimeline = {
    to: vi.fn().mockReturnThis(),
  }
  return {
    gsap: {
      set: vi.fn(),
      timeline: vi.fn(() => mockTimeline),
      to: vi.fn(),
      fromTo: vi.fn(),
    },
  }
})

// 其他模拟保持不变
vi.mock('@/myCanvasJs/useAuroraBackground', () => ({
  useAuroraBackground: vi.fn(),
}))
vi.mock('@/myCanvasJs/useMouseTrail', () => ({
  useMouseTrail: vi.fn(),
}))

const mockLogin = vi.fn()
vi.mock('@/utils/apis/user', () => ({
  Login: vi.fn((...args) => {
    return mockLogin(...args)
  }),
}))

describe('LoginPage.vue', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    // 这里不再需要 fake timers，因为倒计时的测试被移除了
    vi.clearAllMocks()
  })

  const mountComponent = (initialPiniaState = { theme: 'light' }) => {
    wrapper = mount(LoginPage, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              counter: initialPiniaState,
            },
          }),
        ],
      },
    })
  }

  it('正确渲染初始状态（密码登录模式）', () => {
    mountComponent()
    expect(wrapper.find('h1').text()).toBe('登录MyCoolBlog')
    // 确保密码模式的容器存在
    expect(wrapper.find('.password-mode').exists()).toBe(true)
    // 确保邮箱模式的容器不存在
    expect(wrapper.find('.email-code-mode').exists()).toBe(false)
  })

  it('用户输入能够更新 registerBody 数据', async () => {
    mountComponent()

    await wrapper.find('input#username').setValue('testuser')
    await wrapper.find('input#username').trigger('blur')
    await wrapper.find('input#password').setValue('testpassword')
    await wrapper.find('input#password').trigger('blur')
    await wrapper.find('input[type="checkbox"]').setChecked(true)

    expect(wrapper.vm.registerBody.username).toBe('testuser')
    expect(wrapper.vm.registerBody.password).toBe('testpassword')
    expect(wrapper.vm.registerBody.rememberMe).toBe(true)
  })

  it('在密码模式下提交表单，应调用 Login API', async () => {
    const mockRefetch = vi.fn().mockResolvedValue({ data: { token: 'fake-token' } })
    mockLogin.mockReturnValue({ refetch: mockRefetch })

    mountComponent()

    await wrapper.find('input#username').setValue('myuser')
    await wrapper.find('input#username').trigger('blur')
    await wrapper.find('input#password').setValue('mypass')
    await wrapper.find('input#password').trigger('blur')

    await wrapper.find('form').trigger('submit.prevent')

    expect(mockLogin).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledWith('myuser', 'mypass')

    await wrapper.vm.$nextTick()
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it('在暗黑模式下，isDarkMode 计算属性为 true', () => {
    mountComponent({ theme: 'dark' })
    expect(wrapper.vm.isDarkMode).toBe(true)
  })
})
