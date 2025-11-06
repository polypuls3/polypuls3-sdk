import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import type { DataSourceConfig } from '../core/config/dataSource'
import { DEFAULT_DATA_SOURCE_CONFIG } from '../core/config/dataSource'
import type { ThemeConfig } from '../core/config/theme'
import { DEFAULT_THEME_CONFIG, BORDER_RADIUS_VALUES, SPACING_MULTIPLIERS } from '../core/config/theme'

/**
 * Context for Polypuls3 SDK configuration
 */
interface PolypulsContextValue {
  dataSourceConfig: DataSourceConfig
  themeConfig: ThemeConfig
}

const PolypulsContext = createContext<PolypulsContextValue>({
  dataSourceConfig: DEFAULT_DATA_SOURCE_CONFIG,
  themeConfig: DEFAULT_THEME_CONFIG,
})

/**
 * Props for PolypulsProvider
 */
export interface PolypulsProviderProps {
  children: ReactNode
  /**
   * Data source configuration for the SDK
   * Controls whether to use contract calls, subgraph queries, or auto-fallback
   */
  dataSourceConfig?: Partial<DataSourceConfig>
  /**
   * Theme configuration for the SDK
   * Controls visual styling, colors, and effects
   */
  themeConfig?: Partial<ThemeConfig>
}

/**
 * Provider component for Polypuls3 SDK configuration
 *
 * Wrap your app with this provider to configure SDK behavior globally.
 *
 * @example
 * ```tsx
 * // Minimal theme (default)
 * <PolypulsProvider>
 *   <App />
 * </PolypulsProvider>
 *
 * // Premium theme
 * <PolypulsProvider themeConfig={{ preset: 'premium' }}>
 *   <App />
 * </PolypulsProvider>
 *
 * // Custom colors
 * <PolypulsProvider themeConfig={{
 *   preset: 'premium',
 *   colors: { primary: '#ff6b6b' }
 * }}>
 *   <App />
 * </PolypulsProvider>
 * ```
 */
export function PolypulsProvider({
  children,
  dataSourceConfig = {},
  themeConfig = {},
}: PolypulsProviderProps) {
  const config: DataSourceConfig = {
    ...DEFAULT_DATA_SOURCE_CONFIG,
    ...dataSourceConfig,
  }

  const theme: ThemeConfig = useMemo(
    () => ({
      ...DEFAULT_THEME_CONFIG,
      ...themeConfig,
    }),
    [themeConfig]
  )

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement

    // Apply custom colors if provided
    if (theme.colors) {
      if (theme.colors.primary) {
        root.style.setProperty('--polypuls3-primary', theme.colors.primary)
      }
      if (theme.colors.secondary) {
        root.style.setProperty('--polypuls3-secondary', theme.colors.secondary)
      }
      if (theme.colors.success) {
        root.style.setProperty('--polypuls3-success', theme.colors.success)
      }
      if (theme.colors.error) {
        root.style.setProperty('--polypuls3-error', theme.colors.error)
      }
      if (theme.colors.background) {
        root.style.setProperty('--polypuls3-background', theme.colors.background)
      }
      if (theme.colors.foreground) {
        root.style.setProperty('--polypuls3-foreground', theme.colors.foreground)
      }
      if (theme.colors.border) {
        root.style.setProperty('--polypuls3-border', theme.colors.border)
      }
      if (theme.colors.muted) {
        root.style.setProperty('--polypuls3-muted', theme.colors.muted)
      }
    }

    // Apply border radius
    if (theme.borderRadius) {
      root.style.setProperty('--polypuls3-radius', BORDER_RADIUS_VALUES[theme.borderRadius])
    }

    // Apply spacing
    if (theme.spacing) {
      root.style.setProperty('--polypuls3-spacing', SPACING_MULTIPLIERS[theme.spacing].toString())
    }

    return () => {
      // Cleanup custom colors on unmount
      if (theme.colors) {
        Object.keys(theme.colors).forEach((key) => {
          root.style.removeProperty(`--polypuls3-${key}`)
        })
      }
    }
  }, [theme])

  return (
    <PolypulsContext.Provider value={{ dataSourceConfig: config, themeConfig: theme }}>
      <div className={`pp-theme-${theme.preset}`}>{children}</div>
    </PolypulsContext.Provider>
  )
}

/**
 * Hook to access Polypuls3 SDK configuration
 *
 * @example
 * ```tsx
 * const { dataSourceConfig, themeConfig } = usePolypulsConfig()
 * console.log('Using data source:', dataSourceConfig.source)
 * console.log('Using theme:', themeConfig.preset)
 * ```
 */
export function usePolypulsConfig(): PolypulsContextValue {
  return useContext(PolypulsContext)
}
