<template>
  <section class="services" id="services">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">我们的服务</h2>
        <p class="section-subtitle">为您提供一个学习平台</p>
      </div>

      <div class="services-grid">
        <div
          v-for="service in services"
          :key="service.id"
          class="service-card"
          @mouseenter="handleServiceHover(service.id)"
        >
          <div class="service-icon">
            <i :class="service.icon"></i>
          </div>
          <h3 class="service-title">{{ service.title }}</h3>
          <p class="service-description">{{ service.description }}</p>
          <ul class="service-features">
            <li v-for="feature in service.features" :key="feature">{{ feature }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface Service {
  id: number
  icon: string
  title: string
  description: string
  features: string[]
}

const services = reactive<Service[]>([
  {
    id: 1,
    icon: 'fas fa-edit',
    title: '1',
    description: '12',
    features: ['121', '122', '123', '124'],
  },
  {
    id: 2,
    icon: 'fas fa-folder-tree',
    title: '2',
    description: '22',
    features: ['221', '222', '223', '224'],
  },
  {
    id: 3,
    icon: 'fas fa-share-alt',
    title: '3',
    description: '32',
    features: ['321', '322', '323', '324'],
  },
  {
    id: 4,
    icon: 'fas fa-mobile-alt',
    title: '4',
    description: '42',
    features: ['421', '422', '423', '424'],
  },
])

const handleServiceHover = (serviceId: number) => {
  console.log('Service hovered:', serviceId)
}
</script>

<style scoped lang="scss">
.services {
  padding: 40px 0px 0 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.service-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px 30px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.service-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
}

.service-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 24px;
}

.service-features {
  list-style: none;
  padding: 0;

  li {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    margin-bottom: 8px;
    padding-left: 20px;
    position: relative;

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #4ecdc4;
      font-weight: bold;
    }
  }
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 2rem;
  }

  .service-card {
    padding: 30px 20px;
  }
}
</style>
