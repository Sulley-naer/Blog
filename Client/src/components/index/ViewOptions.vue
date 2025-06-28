<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['update:layout'])

const viewTypes = ['近期更新', '热门文章', '最多点赞']
const activeViewType = ref('近期更新')

const activeLayout = ref('list')

const selectViewType = (type: string) => {
    activeViewType.value = type
    console.log('切换视图类型:', type)
}

const selectLayout = (layoutId: 'list' | 'grid') => {
    activeLayout.value = layoutId
    emit('update:layout', layoutId)
}
</script>

<template>
    <div class="view-options-container">
        <div class="control-group view-types">
            <button v-for="type in viewTypes" :key="type" class="option-button"
                :class="{ active: activeViewType === type }" @click="selectViewType(type)">
                {{ type }}
            </button>
        </div>

        <div class="control-group layout-controls">
            <button class="layout-button" :class="{ active: activeLayout === 'list' }" aria-label="切换到列表视图"
                @click="selectLayout('list')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path>
                </svg>
            </button>
            <button class="layout-button" :class="{ active: activeLayout === 'grid' }" aria-label="切换到网格视图"
                @click="selectLayout('grid')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h6v6H4V4zm8 0h6v6h-6V4zM4 14h6v6H4v-6zm8 14h6v6h-6v-6z"></path>
                </svg>
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.view-options-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.control-group {
    display: flex;
    background-color: var(--scrollbar-track-color); 
    padding: 4px;
    border-radius: 10px; 
    gap: 4px;
}

.option-button {
    background-color: transparent;
    border: none;
    color: var(--text-color-secondary);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.25s ease;
    font-size: 0.9rem;
    font-weight: 500;

    &.active {
        background-color: var(--card-bg-color);
        color: var(--text-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
}

.layout-button {
    background-color: transparent;
    border: none;
    border-radius: 8px;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s ease;

    svg {
        width: 20px;
        height: 20px;
        color: var(--text-color-secondary);
        transition: color 0.25s ease;
    }

    &.active {
        background-color: var(--card-bg-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

        svg {
            color: var(--primary-color);
        }
    }
}
</style>
