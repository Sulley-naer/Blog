import { onMounted, onUnmounted, watch, type Ref } from 'vue'

export function useMouseTrail(canvasRef: Ref<HTMLCanvasElement | null>, isDarkMode: Ref<boolean>) {
  let animationFrameId: number
  let trailParticles: any[] = []
  let mouseX = 0
  let mouseY = 0

  const resizeCanvas = () => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.value) return
    const rect = canvasRef.value.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
    createTrailParticle(mouseX, mouseY)
  }

  const createTrailParticle = (x: number, y: number) => {
    const computedStyle = getComputedStyle(document.documentElement)
    const colors = isDarkMode.value
      ? ['--trail-color-1', '--trail-color-2', '--trail-color-3', '--trail-color-4']
      : [
          '--firework-color-1',
          '--firework-color-2',
          '--firework-color-3',
          '--firework-color-4',
          '--firework-color-5',
          '--firework-color-6',
        ]

    const selectedColor = computedStyle
      .getPropertyValue(colors[Math.floor(Math.random() * colors.length)])
      .trim()

    for (let i = 0; i < 3; i++) {
      trailParticles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        decay: Math.random() * 0.02 + 0.01,
        size: Math.random() * 4 + 2,
        color: selectedColor,
      })
    }

    if (trailParticles.length > 200) {
      trailParticles.splice(0, trailParticles.length - 200)
    }
  }

  const drawTrail = () => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    trailParticles = trailParticles.filter((p) => {
      p.x += p.vx
      p.y += p.vy
      p.life -= p.decay
      p.vx *= 0.98
      p.vy *= 0.98

      if (p.life > 0) {
        const opacity = Math.floor(p.life * 255)
          .toString(16)
          .padStart(2, '0')
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fillStyle = p.color + opacity
        ctx.fill()
        return true
      }
      return false
    })
  }

  const start = () => {
    const animate = () => {
      drawTrail()
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
    window.addEventListener('mousemove', handleMouseMove)
  })

  onUnmounted(() => {
    stop()
    window.removeEventListener('resize', resizeCanvas)
    window.removeEventListener('mousemove', handleMouseMove)
  })

  watch(isDarkMode, () => {
    trailParticles = []
  })

  return { start, stop }
}
