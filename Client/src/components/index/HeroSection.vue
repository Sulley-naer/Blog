<template>
  <section class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="gradient-text">探索、创造、分享</span>
      </h1>
      <p class="hero-subtitle">一个记录技术思考与生活灵感的空间。</p>
      <div class="cta-buttons">
        <button class="cta-btn primary">开始探索</button>
        <button class="cta-btn secondary">关于我</button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero-section {
  padding: 6rem 0;
  text-align: center;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  letter-spacing: -0.05em;
}

.gradient-text {
  background: linear-gradient(120deg, var(--primary-color) 30%, color-mix(in srgb, var(--primary-color) 60%, var(--text-color)));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--text-color-secondary);
  max-width: 600px;
  margin: 0 auto 2.5rem;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.cta-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &.primary {
    background-color: var(--primary-color);
    color: white;
  }

  &.secondary {
    background-color: transparent;
    color: var(--primary-color);
    border-color: var(--primary-color);
  }

  &:hover {
    transform: translateY(-3px);
    filter: brightness(1.1);
  }
}

@media (max-width: 768px) {
  .hero-title {
      font-size: 3rem;
    }
  
    .hero-subtitle {
      font-size: 1.25rem;
    }
  }
  
</style>
