<template>
  <section class="hero" id="hero">
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-title">重新定义<br />勾时</h1>
        <p class="hero-subtitle">
          SuiKnit 是大勾时
        </p>

        <div class="cta-buttons">
          <RippleButton variant="primary" @click="handleExploreNotes">
            开始探索
          </RippleButton>
          <RippleButton variant="secondary" @click="handleLearnMore">
            了解更多
          </RippleButton>
        </div>

        <div class="features-preview">
          <FeatureCard
            v-for="feature in features"
            :key="feature.id"
            :feature="feature"
            @hover="handleFeatureHover"
          />
        </div>
      </div>

      <div class="hero-visual">
        <div class="floating-cards">
          <div
            v-for="(card, index) in floatingCards"
            :key="card.id"
            class="floating-card"
            :style="{
              animationDelay: `${index}s`,
              top: card.position.top || 'auto',
              left: card.position.left || 'auto',
              right: card.position.right || 'auto',
              bottom: card.position.bottom || 'auto',
            }"
          >
            <div class="card-title">{{ card.title }}</div>
            <div class="card-content" v-for="n in 3" :key="n"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="expansion-hint">
      <i class="fas fa-chevron-down"></i>
      更多功能即将推出
    </div>
  </section>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import RippleButton from '@/components/ui/RippleButton.vue'
  import FeatureCard from '@/components/homepage/FeatureCard.vue'

  // 定义emit事件
  const emit = defineEmits(['navigateToSlide'])

  // data
  const features = reactive([
    {
      id: 1,
      icon: 'fas fa-search',
      title: '功能1',
      description: '功能1描述',
    },
    {
      id: 2,
      icon: 'fas fa-tags',
      title: '功能2',
      description: '功能2描述',
    },
    {
      id: 3,
      icon: 'fas fa-share-alt',
      title: '功能3',
      description: '功能3描述',
    },
  ])

  // Floating cards dataType
  interface FloatingCard {
    id: number
    title: string
    position: Record<string, string>
  }

  const floatingCards = reactive<FloatingCard[]>([
    {
      id: 1,
      title: 'JavaScript',
      position: {
        top: '50px',
        left: '50px',
      },
    },
    {
      id: 2,
      title: 'Node.js',
      position: {
        top: '120px',
        right: '30px',
      },
    },
    {
      id: 3,
      title: 'React',
      position: {
        bottom: '80px',
        left: '80px',
      },
    },
  ])

  // Methods
  const handleExploreNotes = () => {
    console.log('探索笔记')
  }

  const handleLearnMore = () => {
    console.log('了解更多')
    emit('navigateToSlide', 1)
  }

  const handleFeatureHover = (featureId: number) => {
    console.log('Feature hovered:', featureId)
  }
  </script>

<style scoped lang="scss">
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
}

.hero-content {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.hero-text {
  z-index: 10;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 40px;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.features-preview {
  display: flex;
  gap: 20px;
  margin-top: 40px;
}

.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-cards {
  position: relative;
  width: 400px;
  height: 400px;
}

.floating-card {
  position: absolute;
  width: 200px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: floatCard 4s infinite ease-in-out;

  &:nth-child(2) {
    animation-duration: 5s;
  }

  &:nth-child(3) {
    animation-duration: 4.5s;
  }
}

@keyframes floatCard {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(2deg);
  }
}

.card-title {
  color: white;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

.card-content {
  height: 4px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%);
  border-radius: 2px;
  margin-bottom: 6px;

  &:last-child {
    width: 60%;
  }
}

.expansion-hint {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .features-preview {
    flex-direction: column;
  }

  .floating-cards {
    width: 300px;
    height: 300px;
  }
}
</style>
