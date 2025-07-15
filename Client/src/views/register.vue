<template>
  <div class="register-container">
    <canvas ref="backgroundCanvas" class="background-canvas"></canvas>
    <canvas ref="trailCanvas" class="trail-canvas"></canvas>
    <div class="register-form" ref="registerForm">
      <div class="form-content-wrapper" ref="formContentWrapper">
        <!-- ===== 步骤一 ===== -->
        <div class="form-step step-one">
          <div class="form-header">
            <h1>创建您的账户</h1>
            <p>一切伟大的旅程都始于第一步</p>
          </div>
          <form @submit.prevent="goToNextStep" class="step-form">
            <div class="input-group">
              <label for="username">用户名</label>
              <div class="glass-input">
                <input type="text" id="username" v-model="userRegistered.username" placeholder="设置一个独特的昵称" required />
              </div>
            </div>
            <div class="input-group">
              <label for="email">邮箱地址</label>
              <div class="glass-input">
                <input type="email" id="email" v-model="userRegistered.email" placeholder="用于接收通知和找回密码" required />
              </div>
            </div>
            <div class="input-group verification-group">
              <label for="verificationCode">邮箱验证码</label>
              <div class="glass-input with-button">
                <input type="text" id="verificationCode" v-model="userRegistered.verificationCode"
                  placeholder="请输入6位唯一验证码" required />
                <button type="button" class="send-code-btn" @click="sendVerificationCode" :disabled="isSendingCode">
                  {{ countdown > 0 ? `${countdown}s` : '发送' }}
                </button>
              </div>
            </div>
            <button type="submit" class="action-btn">
              <span>下一步</span>
            </button>
          </form>
        </div>

        <!-- ===== 步骤二 ===== -->
        <div class="form-step step-two">
          <div class="form-header">
            <h1>设置您的密码</h1>
            <p>请使用一个强大且安全的密码</p>
          </div>
          <form @submit.prevent="handleRegister" class="step-form">
            <div class="input-group">
              <label for="password">密码</label>
              <div class="glass-input">
                <input type="password" id="password" v-model="userRegistered.password" @input="validatePassword"
                  placeholder="至少8位，包含字母和数字" required />
              </div>
              <!-- 密码错误提示 -->
              <Transition @enter="onErrorEnter" @leave="onErrorLeave">
                <FormError v-if="passwordError" :message="passwordError" />
              </Transition>
            </div>
            <div class="input-group">
              <label for="confirmPassword">确认密码</label>
              <div class="glass-input">
                <input type="password" id="confirmPassword" v-model="userRegistered.confirmPassword"
                  @input="validatePassword" placeholder="请再次输入密码" required />
              </div>
              <!-- 确认密码错误提示 -->
              <Transition @enter="onErrorEnter" @leave="onErrorLeave">
                <FormError v-if="confirmPasswordError" :message="confirmPasswordError" />
              </Transition>
            </div>
            <div class="form-actions">
              <button type="button" @click="goToPrevStep" class="action-btn secondary-btn">
                <span>上一步</span>
              </button>
              <button type="submit" class="action-btn">
                <span>完成注册</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <p class="switch-link">已经有账户了？ <a href="/login">直接登录</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'RegisterPage' })
import { ref, onMounted, computed, watch } from 'vue'
import { gsap } from 'gsap'
import { useCounterStore } from '@/stores/counter'
import { useAuroraBackground } from '@/AnimationJs/useAuroraBackground'
import { useMouseTrail } from '@/AnimationJs/useMouseTrail'
import FormError from '@/components/FormError.vue'
import { registeredCaptcha } from '@/utils/apis/public'
import { Registered } from '@/utils/apis/user'
import router from '@/router'


const store = useCounterStore()
const registrationStep = ref(1)

const userRegistered = ref({
  email: '',
  username: '',
  verificationCode: '',
  password: '',
  confirmPassword: ''
})

// 为错误信息创建状态
const passwordError = ref('')
const confirmPasswordError = ref('')

const isSendingCode = ref<boolean>(false)
const countdown = ref<number>(0)

const backgroundCanvas = ref<HTMLCanvasElement | null>(null)
const trailCanvas = ref<HTMLCanvasElement | null>(null)
const registerForm = ref<HTMLElement | null>(null)

const isDarkMode = computed(() => store.theme === 'dark')

useAuroraBackground(backgroundCanvas, isDarkMode)
useMouseTrail(trailCanvas, isDarkMode)

const setupIntroAnimation = () => {
  gsap.from(registerForm.value, {
    autoAlpha: 0,
    y: 50,
    scale: 0.95,
    duration: 0.8,
    ease: 'expo.out',
    delay: 0.2,
  })
  gsap.set('.step-two', { xPercent: 100, autoAlpha: 0 })
}

const sendVerificationCode = async () => {
  if (isSendingCode.value) return
  isSendingCode.value = true
  const interval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(interval)
    }
  }, 1000)

  try {
    const { refetch } = registeredCaptcha(userRegistered.value.email)
    refetch().then(() => {
      countdown.value = 60
    }).catch(() => {
      isSendingCode.value = false
      countdown.value = 0
    })
  } catch {
    isSendingCode.value = false
    countdown.value = 0
  }
}

const goToNextStep = () => {
  if (registrationStep.value !== 1) return
  registrationStep.value = 2

  // 第一步滑出到左侧幕后
  gsap.to('.step-one', { duration: 0.5, xPercent: -100, autoAlpha: 0, ease: 'power3.in' })
  // 第二步从右侧幕后滑入舞台中央
  gsap.to('.step-two', { duration: 0.5, xPercent: 0, autoAlpha: 1, ease: 'power3.out', delay: 0.1 })
}

const goToPrevStep = () => {
  if (registrationStep.value !== 2) return
  registrationStep.value = 1

  // 第二步滑出到右侧幕后
  gsap.to('.step-two', { duration: 0.5, xPercent: 100, autoAlpha: 0, ease: 'power3.in' })
  // 第一步从左侧幕后滑入舞台中央
  gsap.to('.step-one', { duration: 0.5, xPercent: 0, autoAlpha: 1, ease: 'power3.out', delay: 0.1 })
}

// 密码校验
const validatePassword = (): boolean => {
  passwordError.value = ''
  confirmPasswordError.value = ''
  let isValid = true

  // 定义密码强度校验的正则表达式
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

  // 只有当用户输入了密码时，才进行强度校验
  if (userRegistered.value.password && !passwordRegex.test(userRegistered.value.password)) {
    passwordError.value = '需为8位以上的字母和数字组合'
    isValid = false
  }

  // 只有当用户输入了确认密码时，才进行一致性校验
  if (userRegistered.value.confirmPassword && userRegistered.value.password !== userRegistered.value.confirmPassword) {
    confirmPasswordError.value = '两次输入的密码不一致'
    isValid = false
  }

  return isValid
}

watch([userRegistered.value.password, userRegistered.value.confirmPassword], () => {
  if (registrationStep.value === 2) {
    validatePassword()
  }
})

const handleRegister = () => {
  if (!validatePassword()) {
    gsap.fromTo(registerForm.value, { x: 0 }, { x: 10, duration: 0.6, ease: 'elastic.out(1, 0.3)' })
    return
  }

  gsap.to(registerForm.value, {
    scale: 1.05,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut',
    onComplete: () => {
      const { refetch } = Registered(
        userRegistered.value.username,
        userRegistered.value.password,
        userRegistered.value.email,
        userRegistered.value.verificationCode
      )
      console.log(
        refetch().then((res) => {
          router.push('/login')
          console.log('res', res)
        }),
      )
    },
  })
}

// 定义错误提示的进入和离开动画
const onErrorEnter = (el: Element, done: () => void) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: -10 },
    { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', onComplete: done },
  )
}

const onErrorLeave = (el: Element, done: () => void) => {
  gsap.to(el, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in', onComplete: done })
}

onMounted(() => {
  setupIntroAnimation()
})
</script>

<style scoped>
.register-container {
  position: relative;
  width: 100vw;
  height: calc(100vh - 60px);
  overflow: hidden;
  background: var(--background-color);
  display: flex;
  justify-content: center;
  align-items: center;
}

.background-canvas,
.trail-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.trail-canvas {
  z-index: 2;
}

.register-form {
  position: relative;
  z-index: 10;
  padding: 30px 40px;
  border-radius: 20px;
  background: rgba(var(--card-bg-color-rgb), 0.1);
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(1px);
  border: 1px solid rgba(var(--text-color-rgb), 0.1);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  width: 420px;
  max-width: 90vw;
  height: 600px;
  overflow: hidden;
}

.form-content-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.form-step {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h1 {
  color: var(--text-color);
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, var(--primary-color), var(--text-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.form-header p {
  color: var(--text-color-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.step-form {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.input-group {
  margin-bottom: 20px;
  position: relative;
}

/* 添加 relative 以便错误提示定位 */
.input-group label {
  display: block;
  color: var(--text-color);
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.glass-input {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(var(--card-bg-color-rgb), 0.2);
  border: 1px solid rgba(var(--text-color-rgb), 0.15);
  transition: all 0.3s ease;
}

.glass-input:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-color), 0.1);
}

.glass-input input {
  width: 100%;
  padding: 14px 20px;
  border: none;
  background: transparent;
  color: var(--text-color);
  font-size: 1rem;
  outline: none;
}

.glass-input.with-button {
  display: flex;
  align-items: center;
  padding-right: 5px;
}

.glass-input.with-button input {
  flex-grow: 1;
}

.send-code-btn {
  flex-shrink: 0;
  padding: 8px 12px;
  margin-left: 10px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition:
    background-color 0.3s,
    opacity 0.3s;
}

.send-code-btn:disabled {
  background-color: var(--text-color-secondary);
  cursor: not-allowed;
}

.switch-link {
  text-align: center;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

.switch-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.action-btn:hover {
  box-shadow: 0 4px 15px rgba(var(--primary-color), 0.3);
}

.secondary-btn {
  background: transparent;
  color: var(--text-color-secondary);
  border-color: var(--text-color-secondary);
  font-weight: 500;
}

.secondary-btn:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: none;
}
</style>
