import { createContext, useContext, type ReactNode } from 'react'
import type { DataSourceConfig } from '../core/config/dataSource'
import { DEFAULT_DATA_SOURCE_CONFIG } from '../core/config/dataSource'

/**
 * Context for Polypuls3 SDK configuration
 */
interface PolypulsContextValue {
  dataSourceConfig: DataSourceConfig
}

const PolypulsContext = createContext<PolypulsContextValue>({
  dataSourceConfig: DEFAULT_DATA_SOURCE_CONFIG,
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
}

/**
 * Provider component for Polypuls3 SDK configuration
 *
 * Wrap your app with this provider to configure SDK behavior globally.
 *
 * @example
 * ```tsx
 * <PolypulsProvider dataSourceConfig={{ source: 'subgraph' }}>
 *   <App />
 * </PolypulsProvider>
 * ```
 */
export function PolypulsProvider({ children, dataSourceConfig = {} }: PolypulsProviderProps) {
  const config: DataSourceConfig = {
    ...DEFAULT_DATA_SOURCE_CONFIG,
    ...dataSourceConfig,
  }

  return (
    <PolypulsContext.Provider value={{ dataSourceConfig: config }}>
      {children}
    </PolypulsContext.Provider>
  )
}

/**
 * Hook to access Polypuls3 SDK configuration
 *
 * @example
 * ```tsx
 * const { dataSourceConfig } = usePolypulsConfig()
 * console.log('Using data source:', dataSourceConfig.source)
 * ```
 */
export function usePolypulsConfig(): PolypulsContextValue {
  return useContext(PolypulsContext)
}
