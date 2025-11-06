import { GraphQLClient } from 'graphql-request'
import { getSubgraphUrl } from './config'
import type { Poll, UserVote, PollFilters, PollsQueryResult } from '../core/types'
import {
  GET_POLL,
  GET_POLLS,
  GET_ACTIVE_POLLS,
  GET_POLLS_BY_CREATOR,
  GET_USER_VOTES,
} from './queries'

/**
 * Create a GraphQL client for the subgraph
 */
export function createSubgraphClient(chainId: number): GraphQLClient | null {
  const url = getSubgraphUrl(chainId)
  if (!url) {
    console.warn(`No subgraph URL configured for chain ${chainId}`)
    return null
  }
  return new GraphQLClient(url)
}

/**
 * Fetch a single poll from the subgraph
 */
export async function fetchPoll(chainId: number, pollId: string): Promise<Poll | null> {
  const client = createSubgraphClient(chainId)
  if (!client) return null

  try {
    const data = await client.request<{ poll: Poll }>(GET_POLL, { id: pollId })
    return data.poll
  } catch (error) {
    console.error('Error fetching poll from subgraph:', error)
    return null
  }
}

/**
 * Fetch multiple polls from the subgraph with filters
 */
export async function fetchPolls(
  chainId: number,
  filters: PollFilters = {}
): Promise<PollsQueryResult> {
  const client = createSubgraphClient(chainId)
  if (!client) {
    return { polls: [], total: 0, hasMore: false }
  }

  try {
    const { limit = 10, offset = 0, creator, status } = filters

    let query = GET_POLLS
    let variables: any = {
      first: limit,
      skip: offset,
    }

    // Use specific queries based on filters
    if (status === 'active') {
      query = GET_ACTIVE_POLLS
    } else if (creator) {
      query = GET_POLLS_BY_CREATOR
      variables.creator = creator
    }

    const data = await client.request<{ polls: Poll[] }>(query, variables)

    return {
      polls: data.polls,
      total: data.polls.length,
      hasMore: data.polls.length === limit,
    }
  } catch (error) {
    console.error('Error fetching polls from subgraph:', error)
    return { polls: [], total: 0, hasMore: false }
  }
}

/**
 * Fetch user votes from the subgraph
 */
export async function fetchUserVotes(
  chainId: number,
  voter: string,
  limit = 10,
  offset = 0
): Promise<UserVote[]> {
  const client = createSubgraphClient(chainId)
  if (!client) return []

  try {
    const data = await client.request<{ votes: UserVote[] }>(GET_USER_VOTES, {
      voter,
      first: limit,
      skip: offset,
    })
    return data.votes
  } catch (error) {
    console.error('Error fetching user votes from subgraph:', error)
    return []
  }
}
