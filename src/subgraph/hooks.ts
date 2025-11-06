import { useEffect, useState } from 'react'
import { useChainId } from 'wagmi'
import type { Poll, UserVote, PollFilters, PollsQueryResult } from '../core/types'
import { fetchPoll, fetchPolls, fetchUserVotes } from './client'

/**
 * Hook to fetch a poll from the subgraph
 */
export function useSubgraphPoll(pollId: string) {
  const chainId = useChainId()
  const [data, setData] = useState<Poll | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const poll = await fetchPoll(chainId, pollId)
        if (!cancelled) {
          setData(poll)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [chainId, pollId])

  return { poll: data, isLoading, error }
}

/**
 * Hook to fetch multiple polls from the subgraph
 */
export function useSubgraphPolls(filters: PollFilters = {}) {
  const chainId = useChainId()
  const [data, setData] = useState<PollsQueryResult>({ polls: [], total: 0, hasMore: false })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const result = await fetchPolls(chainId, filters)
        if (!cancelled) {
          setData(result)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [chainId, JSON.stringify(filters)])

  return { ...data, isLoading, error }
}

/**
 * Hook to fetch user votes from the subgraph
 */
export function useSubgraphUserVotes(voter?: string, limit = 10, offset = 0) {
  const chainId = useChainId()
  const [data, setData] = useState<UserVote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!voter) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const votes = await fetchUserVotes(chainId, voter!, limit, offset)
        if (!cancelled) {
          setData(votes)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [chainId, voter, limit, offset])

  return { votes: data, isLoading, error }
}
