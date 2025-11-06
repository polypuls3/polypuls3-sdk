import { useState, useEffect } from 'react'
import type { PollFilters, PollsQueryResult } from '../core/types'
import type { DataSource } from '../core/config/dataSource'
import { usePolyPulseConfig } from '../providers'
import { useSubgraphPolls } from '../subgraph/hooks'

/**
 * Parameters for usePollsList hook
 */
export interface UsePollsListParams extends PollFilters {
  /**
   * Override the global data source configuration for this hook
   * If not provided, uses the config from PolypulsProvider
   */
  dataSource?: DataSource
}

/**
 * Return type for usePollsList hook
 */
export interface UsePollsListReturn extends PollsQueryResult {
  isLoading: boolean
  error: Error | null
  /**
   * Which data source was actually used
   */
  activeSource: 'contract' | 'subgraph' | null
}

/**
 * Unified hook for fetching a list of polls
 *
 * Supports multiple data sources:
 * - 'contract': Fetch directly from contract (not implemented yet, returns empty)
 * - 'subgraph': Fetch from The Graph subgraph (fast, requires synced subgraph)
 * - 'auto': Try subgraph first, fallback to contract if it fails
 *
 * @example
 * ```tsx
 * // Use global config from provider
 * const { polls, isLoading, activeSource } = usePollsList({ limit: 20 })
 *
 * // Override to always use subgraph
 * const { polls } = usePollsList({ limit: 20, dataSource: 'subgraph' })
 * ```
 */
export function usePollsList(params: UsePollsListParams = {}): UsePollsListReturn {
  const { dataSourceConfig } = usePolyPulseConfig()
  const { dataSource: paramSource, ...filters } = params

  // Determine which data source to use
  const source = paramSource || dataSourceConfig.source

  // For now, we primarily use subgraph
  // In 'auto' mode, we'll use subgraph and fallback if needed
  // Contract-based list fetching would require iterating through all polls which is expensive

  const subgraphResult = useSubgraphPolls(filters)

  const [activeSource, setActiveSource] = useState<'contract' | 'subgraph' | null>(null)

  useEffect(() => {
    if (source === 'contract') {
      // Contract mode not fully implemented for list queries
      // Would require iterating through polls which is expensive
      console.warn('Contract-only mode for poll lists is not recommended. Using subgraph.')
      setActiveSource('subgraph')
    } else {
      // subgraph or auto mode
      setActiveSource('subgraph')
    }
  }, [source])

  // In auto mode, we could implement fallback logic here
  // For now, just use subgraph results

  return {
    ...subgraphResult,
    activeSource,
  }
}
