/**
 * Theme preset types
 */
export type ThemePreset = 'minimal' | 'premium' | 'custom'

/**
 * Spacing options
 */
export type ThemeSpacing = 'compact' | 'normal' | 'comfortable'

/**
 * Border radius options
 */
export type ThemeBorderRadius = 'none' | 'small' | 'medium' | 'large'

/**
 * Widget size options
 */
export type WidgetSize = 'small' | 'medium' | 'large'

/**
 * Color customization
 */
export interface ThemeColors {
  primary?: string
  secondary?: string
  success?: string
  error?: string
  background?: string
  foreground?: string
  border?: string
  muted?: string
}

/**
 * Confetti configuration
 */
export interface ConfettiConfig {
  particleCount?: number
  spread?: number
  colors?: string[]
}

/**
 * Visual effects configuration
 */
export interface ThemeEffects {
  /**
   * Enable gradient backgrounds and borders
   * @default true (premium), false (minimal)
   */
  enableGradients?: boolean

  /**
   * Enable layered shadows for depth
   * @default true (premium), false (minimal)
   */
  enableShadows?: boolean

  /**
   * Enable animations and transitions
   * @default true (premium), false (minimal)
   */
  enableAnimations?: boolean

  /**
   * Enable hover scale and lift effects
   * @default true (premium), false (minimal)
   */
  enableHoverEffects?: boolean

  /**
   * Enable confetti celebration on vote success
   * @default true (premium), false (minimal)
   */
  enableConfetti?: boolean

  /**
   * Confetti animation configuration
   * Only applies when enableConfetti is true
   */
  confettiConfig?: ConfettiConfig
}

/**
 * Complete theme configuration
 */
export interface ThemeConfig {
  /**
   * Theme preset to use
   * - 'minimal': Clean, flat design with subtle interactions
   * - 'premium': Gradients, shadows, animations, visual depth
   * - 'custom': User-defined theme with full control
   * @default 'minimal'
   */
  preset: ThemePreset

  /**
   * Custom color overrides
   * Applies to all presets
   */
  colors?: ThemeColors

  /**
   * Visual effects configuration
   * Only applies when preset is 'custom'
   */
  effects?: ThemeEffects

  /**
   * Spacing between elements
   * @default 'normal'
   */
  spacing?: ThemeSpacing

  /**
   * Border radius for rounded corners
   * @default 'medium'
   */
  borderRadius?: ThemeBorderRadius

  /**
   * Widget size (affects spacing and typography)
   * @default 'medium'
   */
  size?: WidgetSize
}

/**
 * Default theme configuration
 */
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  preset: 'minimal',
  spacing: 'normal',
  borderRadius: 'medium',
  size: 'medium',
}

/**
 * Minimal preset configuration
 */
export const MINIMAL_THEME: Partial<ThemeConfig> = {
  preset: 'minimal',
  effects: {
    enableGradients: false,
    enableShadows: false,
    enableAnimations: true, // Keep subtle animations
    enableHoverEffects: false, // No scale/lift
    enableConfetti: false, // No confetti in minimal theme
  },
}

/**
 * Premium preset configuration
 */
export const PREMIUM_THEME: Partial<ThemeConfig> = {
  preset: 'premium',
  effects: {
    enableGradients: true,
    enableShadows: true,
    enableAnimations: true,
    enableHoverEffects: true,
    enableConfetti: true, // Enable confetti in premium theme
    confettiConfig: {
      particleCount: 100,
      spread: 70,
      colors: ['#8247e5', '#a78bfa', '#22c55e']
    }
  },
}

/**
 * Border radius values in pixels
 */
export const BORDER_RADIUS_VALUES: Record<ThemeBorderRadius, string> = {
  none: '0',
  small: '0.25rem',
  medium: '0.5rem',
  large: '1rem',
}

/**
 * Spacing multipliers
 */
export const SPACING_MULTIPLIERS: Record<ThemeSpacing, number> = {
  compact: 0.75,
  normal: 1,
  comfortable: 1.25,
}
