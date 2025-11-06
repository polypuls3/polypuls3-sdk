import confetti from 'canvas-confetti'

export interface ConfettiConfig {
  particleCount?: number
  spread?: number
  colors?: string[]
  constrained?: boolean
  origin?: { x?: number; y?: number }
}

/**
 * Create a confetti instance for a specific canvas element
 * Used for constrained confetti within widget boundaries
 * @param canvas HTMLCanvasElement to render confetti on
 */
export const createConfettiInstance = (canvas: HTMLCanvasElement) => {
  return confetti.create(canvas, {
    resize: true,
    useWorker: false, // Keep false to avoid canvas manipulation errors
    disableForReducedMotion: true,
  })
}

/**
 * Trigger confetti celebration animation
 * @param config Optional configuration to override defaults
 * @param canvasElement Optional canvas element for constrained confetti
 */
export const celebrateVote = (config?: ConfettiConfig, canvasElement?: HTMLCanvasElement | null) => {
  const defaults: ConfettiConfig = {
    particleCount: 100,
    spread: 70,
    colors: ['#8247e5', '#a78bfa', '#22c55e'],
    constrained: false,
    origin: { y: 0.6 },
  }

  const finalConfig = { ...defaults, ...config }

  // Use constrained confetti if canvas element provided or constrained mode enabled
  const confettiFunc = (finalConfig.constrained && canvasElement)
    ? createConfettiInstance(canvasElement)
    : confetti

  confettiFunc({
    particleCount: finalConfig.particleCount,
    spread: finalConfig.spread,
    colors: finalConfig.colors,
    origin: finalConfig.origin,
    ticks: 200,
  })
}
