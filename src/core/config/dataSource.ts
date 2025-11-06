/**
 * Data source types for fetching poll data
 */
export type DataSource = 'contract' | 'subgraph' | 'auto'

/**
 * Configuration for data source behavior
 */
export interface DataSourceConfig {
  /**
   * Preferred data source for fetching polls
   * - 'contract': Always use contract calls (most authoritative, slower for lists)
   * - 'subgraph': Always use subgraph queries (faster for lists, requires synced subgraph)
   * - 'auto': Try subgraph first, fallback to contract if subgraph fails
   */
  source: DataSource

  /**
   * Timeout for subgraph requests in milliseconds
   * If subgraph doesn't respond within this time in 'auto' mode, fallback to contract
   * @default 5000
   */
  subgraphTimeout?: number

  /**
   * Whether to enable automatic retry with contract if subgraph fails
   * Only applies in 'auto' mode
   * @default true
   */
  autoFallback?: boolean
}

/**
 * Default data source configuration
 */
export const DEFAULT_DATA_SOURCE_CONFIG: DataSourceConfig = {
  source: 'auto',
  subgraphTimeout: 5000,
  autoFallback: true,
}
