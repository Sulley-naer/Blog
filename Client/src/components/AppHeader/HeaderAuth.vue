<script setup lang="ts">
import { useRouter } from 'vue-router' // 1. 导入 useRouter
import UserProfile from './UserProfile.vue'

defineProps<{
    isLoggedIn: boolean
    user: { name: string; avatar: string; email: string }
}>()

const emit = defineEmits(['register', 'logout'])

const router = useRouter()

const handleLoginClick = () => {
    router.push('/login')
}
const handleRegisterClick = () => {
    router.push('/register')
}
</script>

<template>
    <div v-if="!isLoggedIn" class="auth-buttons">
        <button @click="handleLoginClick" class="auth-btn login-btn">登录</button>
        <button @click="handleRegisterClick" class="auth-btn register-btn">注册</button>
    </div>
    <UserProfile v-else :user="user" @logout="emit('logout')" />
</template>

<style scoped lang="scss">
.auth-buttons {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.auth-btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid;

    &.login-btn {
        background: transparent;
        color: var(--text-color);
        border-color: var(--text-color-secondary);

        &:hover {
            color: var(--primary-color);
            border-color: var(--primary-color);
        }
    }

    &.register-btn {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);

        &:hover {
            background: color-mix(in srgb, var(--primary-color) 90%, black);
            border-color: color-mix(in srgb, var(--primary-color) 90%, black);
        }
    }
}

@media (max-width: 768px) {
    .auth-buttons {
        gap: 0.5rem;

        .auth-btn {
            padding: 0.375rem 0.75rem;
            font-size: 0.8rem;
        }
    }
}
</style>
