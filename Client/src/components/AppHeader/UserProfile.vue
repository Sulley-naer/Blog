<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
    user: { name: string; avatar: string; email: string }
}>()

const emit = defineEmits(['logout'])

const showUserDropdown = ref(false)
const toggleUserDropdown = () => {
    showUserDropdown.value = !showUserDropdown.value
}

const containerRef = ref<HTMLElement | null>(null)
const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
        showUserDropdown.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside, true)
})
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside, true)
})
</script>

<template>
    <div class="user-dropdown-container" ref="containerRef">
        <button @click="toggleUserDropdown" class="user-profile-btn">
            <img :src="user.avatar" :alt="user.name" class="user-avatar" />
            <span class="user-name">{{ user.name }}</span>
            <svg class="dropdown-icon" :class="{ 'rotated': showUserDropdown }" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
        </button>

        <Transition name="fade-scale">
            <div v-show="showUserDropdown" class="user-dropdown">
                <div class="dropdown-header">
                    <img :src="user.avatar" :alt="user.name" class="dropdown-avatar" />
                    <div class="user-info">
                        <div class="user-display-name">{{ user.name }}</div>
                        <div class="user-email">{{ user.email }}</div>
                    </div>
                </div>
                <div class="dropdown-divider"></div>
                <a href="/user" class="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    个人资料
                </a>
                <a href="#" class="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    我的文章
                </a>
                <div class="dropdown-divider"></div>
                <button @click="emit('logout')" class="dropdown-item logout-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16,17 21,12 16,7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    退出登录
                </button>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
/* --- 按钮和布局样式保持不变 --- */
.user-dropdown-container {
    position: relative;
}

.user-profile-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    color: var(--text-color);

    &:hover {
        background-color: var(--background-color);
    }
}

.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--primary-color);
}

.user-name {
    font-weight: 500;
    font-size: 0.875rem;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dropdown-icon {
    transition: transform 0.2s ease;

    &.rotated {
        transform: rotate(180deg);
    }
}

/* --- 【核心修改】下拉菜单的全新样式 --- */
.user-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.75rem;
    width: 240px;
    border-radius: 12px;
    overflow: hidden;
    z-index: 1001;

    /* 毛玻璃效果 */
    background: var(--dropdown-bg);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);

    /* 边框和阴影 */
    border: 1px solid var(--dropdown-border-color);
    box-shadow: var(--dropdown-shadow);
}

.dropdown-header {
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.dropdown-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.user-info {
    flex: 1;
    min-width: 0;
}

.user-display-name {
    font-weight: 600;
    color: var(--text-color);
    font-size: 0.875rem;
}

.user-email {
    color: var(--text-color-secondary);
    font-size: 0.75rem;
    margin-top: 0.125rem;
}

.dropdown-divider {
    height: 1px;
    background: var(--dropdown-divider-color);
    margin: 0.5rem 0;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    color: var(--text-color);
    text-decoration: none;
    font-size: 0.875rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: var(--dropdown-item-hover-bg);
    }

    svg {
        flex-shrink: 0;
        color: var(--text-color-secondary);
    }

    &.logout-item {
        color: #e53e3e;

        svg {
            color: #e53e3e;
        }

        &:hover {
            background-color: rgba(229, 62, 62, 0.1);
        }
    }
}

/* --- 动画和响应式样式保持不变 --- */
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}

@media (max-width: 768px) {
    .user-name {
        display: none;
    }

    .user-dropdown {
        width: 200px;
    }
}
</style>
