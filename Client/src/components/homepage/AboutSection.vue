<template>
  <section class="about" id="about">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">关于我们</h2>
        <p class="section-subtitle">了解 SuiKnit 的使命和愿景</p>
      </div>

      <div class="about-content">
        <div class="about-text">
          <h3>我们的使命</h3>
          <p>
           待定
          </p>

          <h3>我们的愿景</h3>
          <p>
            待定
          </p>

          <div class="stats">
            <div class="stat-item">
              <div class="stat-number">10K+</div>
              <div class="stat-label">活跃用户</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">50K+</div>
              <div class="stat-label">笔记数量</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">200%</div>
              <div class="stat-label">用户满意度</div>
            </div>
          </div>
        </div>

        <div class="about-visual">
          <div class="visual-element">
            <img class=" w-full h-full" src="@/assets/images/logo/logo.jpg" alt="">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.about {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;
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

.about-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 60px;
  align-items: center;
}

.about-text {
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 16px;
    margin-top: 32px;

    &:first-child {
      margin-top: 0;
    }
  }

  p {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.7;
    margin-bottom: 24px;
  }
}

.stats {
  display: flex;
  gap: 40px;
  margin-top: 40px;
}

.stat-item {
  text-align: center;

  .stat-number {
    font-size: 2.5rem;
    font-weight: 800;
    color: #4ecdc4;
    margin-bottom: 8px;
  }

  .stat-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.about-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual-element {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

@media (max-width: 768px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .stats {
    justify-content: center;
    flex-wrap: wrap;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>
