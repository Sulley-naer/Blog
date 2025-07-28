<template>
  <div class="loading-container" v-if="counterStore.awaitLoad">
    <div class="mask"></div>
    <DotLottieVue style="height: 200px; width: 200px" autoplay loop :src="Lottie" />
  </div>
</template>
<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { useCounterStore } from '@/stores/counter'
import loadingLight from '@/assets/myLottie/loading_light.lottie'

const counterStore = useCounterStore()

const Lottie = loadingLight
</script>
<style scoped lang="scss">
.loading-container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  inset: 0;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 999;
  animation: fade-in-loading 1s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fade-in-loading {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: -1;
  pointer-events: all;
  animation: fade-in-loading 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
