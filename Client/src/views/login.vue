<template>
    <div class="login-container">
        <canvas ref="backgroundCanvas" class="background-canvas"></canvas>
        <canvas ref="trailCanvas" class="trail-canvas"></canvas>

        <div class="login-form" ref="loginForm">
            <div class="form-header">
                <h1>登录MyCoolBlog</h1>
                <p>欢迎回来</p>
            </div>

            <form @submit.prevent="handleLogin">
                <div class="input-group">
                    <label for="username">用户名</label>
                    <div class="glass-input">
                        <input type="text" id="username" v-model="username" placeholder="请输入用户名" required />
                    </div>
                </div>

                <div class="input-group">
                    <label for="password">密码</label>
                    <div class="glass-input">
                        <input type="password" id="password" v-model="password" placeholder="请输入密码" required />
                    </div>
                </div>

                <div class="form-options">
                    <label class="checkbox-container">
                        <input type="checkbox" v-model="rememberMe">
                        <span class="checkmark"></span>
                        记住我
                    </label>
                    <a href="#" class="forgot-password">忘记密码？</a>
                </div>

                <button type="submit" class="login-btn">
                    <span>登录</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { gsap } from 'gsap'
import { useCounterStore } from '@/stores/counter'
import { useAuroraBackground } from '@/myCanvasJs/useAuroraBackground'
import { useMouseTrail } from '@/myCanvasJs/useMouseTrail'

const store = useCounterStore()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)

const backgroundCanvas = ref<HTMLCanvasElement | null>(null)
const trailCanvas = ref<HTMLCanvasElement | null>(null)
const loginForm = ref<HTMLElement | null>(null)

const isDarkMode = computed(() => store.theme === 'dark')

useAuroraBackground(backgroundCanvas, isDarkMode)
useMouseTrail(trailCanvas, isDarkMode)

const setupIntroAnimation = () => {
    const formElements = loginForm.value?.querySelectorAll('.form-header, .input-group, .form-options, .login-btn')

    gsap.set(loginForm.value, { scale: 0.8, opacity: 0, y: 50 })
    gsap.set(formElements, { opacity: 0, y: 30 })

    const tl = gsap.timeline({ delay: 0.2 })
    tl.to(loginForm.value, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
    }).to(formElements, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.5")
}

const handleLogin = () => {
    if (!loginForm.value) return;
    gsap.to(loginForm.value.querySelector('.login-btn'), {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
    });
    console.log('登录:', { username: username.value, password: password.value, rememberMe: rememberMe.value })
}

onMounted(() => {
    setupIntroAnimation()
})
</script>

<style scoped>
/* 样式部分完全保持不变 */
.login-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: var(--background-color);
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

.login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    padding: 40px;
    border-radius: 20px;
    background: rgba(var(--card-bg-color-rgb), 0.1);
    backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px);
    border: 1px solid rgba(var(--text-color-rgb), 0.1);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    width: 400px;
    max-width: 90vw;
}

.form-header {
    text-align: center;
    margin-bottom: 30px;
    position: relative;
    z-index: 1;
}

.form-header h1 {
    color: var(--text-color);
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 10px 0;
    background: linear-gradient(135deg, var(--primary-color), var(--text-color));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.form-header p {
    color: var(--text-color-secondary);
    font-size: 1rem;
    margin: 0;
}

.input-group {
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
}

.input-group label {
    display: block;
    color: var(--text-color);
    font-weight: 500;
    margin-bottom: 8px;
    font-size: 0.9rem;
}

.glass-input {
    position: relative;
    border-radius: 12px;
    background: rgba(var(--card-bg-color-rgb), 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(var(--text-color-rgb), 0.15);
    overflow: hidden;
    transition: all 0.3s ease;
}

.glass-input:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(var(--primary-color), 0.1);
    transform: translateY(-2px);
}

.glass-input input {
    width: 100%;
    padding: 15px 20px;
    border: none;
    background: transparent;
    color: var(--text-color);
    font-size: 1rem;
    outline: none;
}

.glass-input input::placeholder {
    color: var(--text-color-secondary);
    opacity: 0.7;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    position: relative;
    z-index: 1;
}

.checkbox-container {
    display: flex;
    align-items: center;
    color: var(--text-color);
    font-size: 0.9rem;
    cursor: pointer;
}

.checkbox-container input[type="checkbox"] {
    margin-right: 8px;
    accent-color: var(--primary-color);
}

.forgot-password {
    color: var(--primary-color);
    text-decoration: none;
    font-size: 0.9rem;
    transition: opacity 0.3s ease;
}

.forgot-password:hover {
    opacity: 0.8;
}

.login-btn {
    width: 100%;
    padding: 15px;
    border: 1px solid rgba(var(--text-color-rgb), 0.2);
    border-radius: 12px;
    background: linear-gradient(135deg, var(--primary-color), rgba(var(--primary-color), 0.8));
    color: var(--text-color);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    z-index: 1;
    box-shadow:
        0 4px 15px rgba(var(--primary-color), 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.login-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
}

.login-btn:hover::before {
    left: 100%;
}

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow:
        0 8px 25px rgba(var(--primary-color), 0.3),
        0 4px 15px rgba(var(--primary-color), 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border-color: rgba(var(--text-color-rgb), 0.3);
}

.login-btn:active {
    transform: translateY(0);
}

@media (max-width: 480px) {
    .login-form {
        width: 350px;
        padding: 30px 25px;
    }

    .form-header h1 {
        font-size: 2rem;
    }
}
</style>
