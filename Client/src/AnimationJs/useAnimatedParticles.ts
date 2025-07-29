import { onMounted, onUnmounted, type Ref } from 'vue'

interface Particle {
  x: number
  y: number
  originalX: number
  originalY: number
  size: number
  speed: number
  opacity: number
  drift: number
  driftSpeed: number
}

/**
 * @description 创建并管理Canvas动画粒子效果
 * @param canvasRef - Canvas元素的引用
 * @param particleCount - 粒子数量，默认50个
 */
export function useAnimatedParticles(
  canvasRef: Ref<HTMLCanvasElement | null>, 
  particleCount: number = 50
) {
  let animationFrameId: number
  let particles: Particle[] = []
  
  /**
   * @description 调整Canvas尺寸以匹配窗口大小
   */
  const resizeCanvas = () => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  
  /**
   * @description 初始化粒子数组
   */
  const initParticles = () => {
    particles = []
    const canvas = canvasRef.value
    if (!canvas) return
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        originalX: Math.random() * canvas.width,
        originalY: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.3,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.02 + 0.005
      })
    }
  }
  
  /**
   * @description 绘制所有粒子
   */
  const drawParticles = () => {
    if (!canvasRef.value) return
    
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')!
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 绘制每个粒子
    particles.forEach(particle => {
      // 更新粒子位置，添加漂移效果
      particle.drift += particle.driftSpeed
      particle.x = particle.originalX + Math.sin(particle.drift) * 10
      particle.y = particle.originalY + Math.cos(particle.drift * 0.7) * 10
      
      // 绘制粒子
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
      ctx.fill()
    })
  }
  
  /**
   * @description 开始动画循环
   */
  const startAnimation = () => {
    const animate = () => {
      drawParticles()
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  }
  
  /**
   * @description 停止动画
   */
  const stopAnimation = () => {
    cancelAnimationFrame(animationFrameId)
  }
  
  // 生命周期钩子
  onMounted(() => {
    resizeCanvas()
    initParticles()
    startAnimation()
    window.addEventListener('resize', () => {
      resizeCanvas()
      initParticles()
    })
  })
  
  onUnmounted(() => {
    stopAnimation()
    window.removeEventListener('resize', resizeCanvas)
  })
  
  return {
    startAnimation,
    stopAnimation
  }
}