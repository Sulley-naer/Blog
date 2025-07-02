// src/views/__tests__/register.spec.ts

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import RegisterPage from '../register.vue'

// --- 模拟模块 ---
let mockRouterPush: ReturnType<typeof vi.fn>
let mockRegisteredCaptcha: ReturnType<typeof vi.fn>
let mockRegistered: ReturnType<typeof vi.fn>

vi.mock('gsap', () => ({
  gsap: {
    set: vi.fn(),
    from: vi.fn(),
    to: vi.fn((targets, vars) => {
      if (vars && typeof vars.onComplete === 'function') {
        vars.onComplete()
      }
    }),
    fromTo: vi.fn((targets, fromVars, toVars) => {
      if (toVars && typeof toVars.onComplete === 'function') {
        toVars.onComplete()
      }
    }),
  },
}))

vi.mock('@/myCanvasJs/useAuroraBackground', () => ({ useAuroraBackground: vi.fn() }))
vi.mock('@/myCanvasJs/useMouseTrail', () => ({ useMouseTrail: vi.fn() }))

vi.mock('@/utils/apis/public', () => ({
  registeredCaptcha: (...args: any[]) => mockRegisteredCaptcha(...args),
}))
vi.mock('@/utils/apis/user', () => ({
  Registered: (...args: any[]) => mockRegistered(...args),
}))
vi.mock('@/router', () => ({
  default: {
    push: (...args: any[]) => mockRouterPush(...args),
  },
}))

describe('RegisterPage.vue', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    mockRouterPush = vi.fn()
    // `registeredCaptcha` 在组件中被 await，所以 mockResolvedValue 是正确的
    mockRegisteredCaptcha = vi
      .fn()
      .mockResolvedValue({ refetch: vi.fn().mockResolvedValue({ success: true }) })
    // `Registered` 在组件中被同步调用，所以必须用 mockReturnValue
    mockRegistered = vi.fn().mockReturnValue({
      refetch: vi.fn().mockResolvedValue({ success: true, token: 'fake-token' }),
    })

    vi.useFakeTimers()
    wrapper = mount(RegisterPage, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: { FormError: true, Transition: true },
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('正确渲染注册表单第一步', () => {
    expect(wrapper.find('.step-one').isVisible()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('创建您的账户')
    expect(wrapper.find('input#username').exists()).toBe(true)
  })

  it('点击发送验证码按钮后，API被调用且开始倒计时', async () => {
    await wrapper.find('input#email').setValue('test@example.com')
    await wrapper.find('button.send-code-btn').trigger('click')

    expect(mockRegisteredCaptcha).toHaveBeenCalledWith('test@example.com')
    await wrapper.vm.$nextTick()

    const sendBtn = wrapper.find('button.send-code-btn')
    expect(sendBtn.attributes('disabled')).toBeDefined()
    expect(sendBtn.text()).toBe('60s')

    vi.advanceTimersByTime(5000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button.send-code-btn').text()).toBe('55s')
  })

  it('填写第一步信息后，能成功进入第二步', async () => {
    await wrapper.find('input#username').setValue('testuser')
    await wrapper.find('input#email').setValue('test@example.com')
    await wrapper.find('input#verificationCode').setValue('123456')
    await wrapper.find('.step-one .step-form').trigger('submit.prevent')

    expect(wrapper.vm.registrationStep).toBe(2)
  })

  it('在第二步时，点击“上一步”能成功返回第一步', async () => {
    wrapper.vm.registrationStep = 2
    await wrapper.vm.$nextTick()
    await wrapper.find('.step-two .secondary-btn').trigger('click')

    expect(wrapper.vm.registrationStep).toBe(1)
  })

  it('密码校验不通过时，不执行注册', async () => {
    wrapper.vm.registrationStep = 2
    await wrapper.vm.$nextTick()
    await wrapper.find('input#password').setValue('123')
    await wrapper.find('input#confirmPassword').setValue('123')
    await wrapper.find('.step-two .step-form').trigger('submit.prevent')

    expect(wrapper.vm.passwordError).not.toBe('')
    expect(mockRegistered).not.toHaveBeenCalled()
  })

  it('两次输入的密码不一致时，不执行注册', async () => {
    wrapper.vm.registrationStep = 2
    await wrapper.vm.$nextTick()
    await wrapper.find('input#password').setValue('password123')
    await wrapper.find('input#confirmPassword').setValue('password456')
    await wrapper.find('.step-two .step-form').trigger('submit.prevent')

    expect(wrapper.vm.confirmPasswordError).not.toBe('')
    expect(mockRegistered).not.toHaveBeenCalled()
  })

  it('完整填写并提交表单后，应调用注册API并跳转路由', async () => {
    // 步骤一
    await wrapper.find('input#username').setValue('finaluser')
    await wrapper.find('input#email').setValue('final@example.com')
    await wrapper.find('input#verificationCode').setValue('123456')
    await wrapper.find('.step-one .step-form').trigger('submit.prevent')

    // 步骤二
    await wrapper.vm.$nextTick()
    await wrapper.find('input#password').setValue('password123')
    await wrapper.find('input#confirmPassword').setValue('password123')
    await wrapper.find('.step-two .step-form').trigger('submit.prevent')

    // 验证
    expect(mockRegistered).toHaveBeenCalledWith(
      'finaluser',
      'password123',
      'final@example.com',
      '123456',
    )
    expect(mockRouterPush).toHaveBeenCalledWith('/login')
  })
})
