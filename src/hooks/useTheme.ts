import { usePolyPulseConfig } from '../providers'
import type { ThemePreset, ThemeColors } from '../core/config/theme'

/**
 * Hook return type for useTheme
 */
export interface UseThemeReturn {
  /**
   * Current theme preset
   */
  preset: ThemePreset

  /**
   * Current custom colors (if any)
   */
  colors: ThemeColors | undefined

  /**
   * Whether the current theme is 'minimal'
   */
  isMinimal: boolean

  /**
   * Whether the current theme is 'premium'
   */
  isPremium: boolean

  /**
   * Whether the current theme is 'custom'
   */
  isCustom: boolean
}

/**
 * Hook to access current theme configuration
 *
 * Provides easy access to theme preset and checks for conditional rendering.
 *
 * @example
 * ```tsx
 * const { preset, isPremium, isMinimal } = useTheme()
 *
 * return (
 *   <div>
 *     Current theme: {preset}
 *     {isPremium && <PremiumFeature />}
 *     {isMinimal && <MinimalFeature />}
 *   </div>
 * )
 * ```
 */
export function useTheme(): UseThemeReturn {
  const { themeConfig } = usePolyPulseConfig()

  return {
    preset: themeConfig.preset,
    colors: themeConfig.colors,
    isMinimal: themeConfig.preset === 'minimal',
    isPremium: themeConfig.preset === 'premium',
    isCustom: themeConfig.preset === 'custom',
  }
}
