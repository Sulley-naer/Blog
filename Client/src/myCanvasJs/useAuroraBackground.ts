import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'

export function useAuroraBackground(
  canvasRef: Ref<HTMLCanvasElement | null>,
  isDarkMode: Ref<boolean>,
) {
  let animationFrameId: number
  let stars: any[] = []

  const resizeCanvas = () => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    if (isDarkMode.value) {
      generateStars()
    }
  }

  const generateStars = () => {
    if (!canvasRef.value) return
    stars = []
    const canvas = canvasRef.value
    const numStars = Math.floor((canvas.width * canvas.height) / 8000)

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
      })
    }
  }

  const drawBackground = () => {
    if (!canvasRef.value || !isDarkMode.value) return
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    stars.forEach((star) => {
      star.x += star.vx
      star.y += star.vy

      if (star.x < 0) star.x = canvas.width
      if (star.x > canvas.width) star.x = 0
      if (star.y < 0) star.y = canvas.height
      if (star.y > canvas.height) star.y = 0

      star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.01
      star.opacity = Math.max(0.1, Math.min(1, star.opacity))

      ctx.beginPath()
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
      ctx.fill()
    })
  }

  const start = () => {
    const animate = () => {
      drawBackground()
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  }

  const stop = () => {
    cancelAnimationFrame(animationFrameId)
  }

  onMounted(() => {
    resizeCanvas()
    start()
    window.addEventListener('resize', resizeCanvas)
  })

  onUnmounted(() => {
    stop()
    window.removeEventListener('resize', resizeCanvas)
  })

  watch(isDarkMode, (isDark) => {
    if (isDark) {
      generateStars()
    } else if (canvasRef.value) {
      canvasRef.value
        .getContext('2d')!
        .clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    }
  })

  return { start, stop }
}
