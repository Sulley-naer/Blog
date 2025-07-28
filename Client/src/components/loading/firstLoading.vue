<script setup lang="ts">
import { gsap } from 'gsap';
import { ref, onMounted } from 'vue';

const leftDiv = ref<HTMLElement | null>(null);
const rightDiv = ref<HTMLElement | null>(null);

const isShow = ref(true);

onMounted(() => {
    if (leftDiv.value && rightDiv.value) {
        const tl = gsap.timeline({
            onComplete() {
                isShow.value = false;
                localStorage.setItem('onceLoad', 'false');
            }
        });
        tl.to(leftDiv.value, { duration: 1, x: '-100%', ease: 'power2.inOut' }, 0);
        tl.to(rightDiv.value, { duration: 1, x: '100%', ease: 'power2.inOut' }, 0);
    }
});
</script>

<template>
    <div v-if="isShow" class="loading">
        <div class="L" ref="leftDiv">
        </div>
        <div class="R" ref="rightDiv">
            <div></div>
        </div>
    </div>
</template>

<style scoped>
.loading {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 999;
}

.L {
    position: absolute;
    left: 0;
    top: 0;
    width: 70%;
    height: 100%;
    background-color: var(--header-bg-color);
    clip-path: polygon(0 0, 50% 0, 100% 100%, 0% 100%);
}

.R {
    position: absolute;
    right: 0;
    top: 0;
    width: 70%;
    height: 100%;
    background-color: var(--hljs-background);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 100%);
}
</style>
    
