import confetti from 'canvas-confetti'

export interface ConfettiConfig {
  particleCount?: number
  spread?: number
  colors?: string[]
}

/**
 * Trigger confetti celebration animation
 * @param config Optional configuration to override defaults
 */
export const celebrateVote = (config?: ConfettiConfig) => {
  const defaults: ConfettiConfig = {
    particleCount: 100,
    spread: 70,
    colors: ['#8247e5', '#a78bfa', '#22c55e']
  }

  const finalConfig = { ...defaults, ...config }

  confetti({
    particleCount: finalConfig.particleCount,
    spread: finalConfig.spread,
    colors: finalConfig.colors,
    origin: { y: 0.6 },
    ticks: 200,
  })
}
