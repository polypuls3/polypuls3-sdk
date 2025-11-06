import { useState, useEffect } from 'react'
import { useChainId, useConfig } from 'wagmi'
import type { PollFilters, PollsQueryResult } from '../core/types'
import type { DataSource } from '../core/config/dataSource'
import { usePolyPulseConfig } from '../providers'
import { useSubgraphPolls } from '../subgraph/hooks'
import { fetchPollsFromContract } from '../core/contracts/pollsList'

/**
 * Parameters for usePollsList hook
 */
export interface UsePollsListParams extends PollFilters {
  /**
   * Override the global data source configuration for this hook
   * If not provided, uses the config from PolyPulseProvider
   */
  dataSource?: DataSource
  /**
   * Chain ID to use for contract calls
   * If not provided, uses the connected wallet's chain
   */
  chainId?: number
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
 * - 'contract': Fetch directly from blockchain contract (real-time, no indexing delay)
 * - 'subgraph': Fetch from The Graph subgraph (fast queries, efficient filtering)
 * - 'auto': Try subgraph first, fallback to contract if it fails
 *
 * @example
 * ```tsx
 * // Use global config from provider
 * const { polls, isLoading, activeSource } = usePollsList({ limit: 20 })
 *
 * // Override to always use contract
 * const { polls } = usePollsList({ limit: 20, dataSource: 'contract' })
 * ```
 */
export function usePollsList(params: UsePollsListParams = {}): UsePollsListReturn {
  const config = useConfig()
  const connectedChainId = useChainId()
  const { dataSourceConfig } = usePolyPulseConfig()
  const { dataSource: paramSource, chainId: paramChainId, ...filters } = params

  // Determine which data source to use
  const source = paramSource || dataSourceConfig.source
  const chainId = paramChainId || connectedChainId

  // State for contract-fetched data
  const [contractData, setContractData] = useState<PollsQueryResult>({
    polls: [],
    total: 0,
    hasMore: false,
  })
  const [contractLoading, setContractLoading] = useState(false)
  const [contractError, setContractError] = useState<Error | null>(null)

  // Subgraph data
  const subgraphResult = useSubgraphPolls(filters)

  // State for active source
  const [activeSource, setActiveSource] = useState<'contract' | 'subgraph' | null>(null)

  // Fetch from contract when in contract mode
  useEffect(() => {
    if (source === 'contract') {
      setActiveSource('contract')
      setContractLoading(true)
      setContractError(null)

      fetchPollsFromContract(config, chainId, filters)
        .then((data) => {
          setContractData(data)
          setContractLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching polls from contract:', error)
          setContractError(error)
          setContractLoading(false)
        })
    } else if (source === 'subgraph') {
      setActiveSource('subgraph')
    } else if (source === 'auto') {
      // In auto mode, try subgraph first
      if (subgraphResult.error) {
        // If subgraph fails, fallback to contract
        setActiveSource('contract')
        setContractLoading(true)
        setContractError(null)

        fetchPollsFromContract(config, chainId, filters)
          .then((data) => {
            setContractData(data)
            setContractLoading(false)
          })
          .catch((error) => {
            console.error('Error fetching polls from contract:', error)
            setContractError(error)
            setContractLoading(false)
          })
      } else {
        setActiveSource('subgraph')
      }
    }
  }, [source, chainId, filters.limit, filters.offset, filters.creator, filters.status, subgraphResult.error])

  // Return appropriate data based on active source
  if (activeSource === 'contract') {
    return {
      ...contractData,
      isLoading: contractLoading,
      error: contractError,
      activeSource: 'contract',
    }
  }

  // Default to subgraph
  return {
    ...subgraphResult,
    activeSource: 'subgraph',
  }
}
