import { GraphQLClient } from 'graphql-request'
import { getSubgraphUrl } from './config'
import type { Poll, UserVote, PollFilters, PollsQueryResult } from '../core/types'
import {
  GET_POLL_BY_POLL_ID,
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
 * Queries by numeric pollId (not entity ID)
 */
export async function fetchPoll(chainId: number, pollId: string): Promise<Poll | null> {
  const client = createSubgraphClient(chainId)
  if (!client) return null

  try {
    // Query by numeric pollId instead of entity ID
    const data = await client.request<{ polls: any[] }>(GET_POLL_BY_POLL_ID, { pollId })
    if (!data.polls || data.polls.length === 0) return null

    const poll = data.polls[0]

    // Transform subgraph response to Poll type
    return {
      id: poll.pollId,
      creator: poll.creator,
      question: poll.question,
      options: poll.options, // Already a string array
      createdAt: BigInt(poll.createdAt),
      expiresAt: BigInt(poll.expiresAt),
      rewardPool: BigInt(poll.rewardPool),
      isActive: poll.isActive,
      totalResponses: BigInt(poll.totalResponses),
      category: poll.category,
      projectId: BigInt(poll.projectId),
      votingType: poll.votingType,
      visibility: poll.visibility,
      status: parseInt(poll.status),
      platformFeeAmount: BigInt(poll.platformFeeAmount),
      claimedRewards: BigInt(poll.claimedRewards),
    }
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

    const data = await client.request<{ polls: any[] }>(query, variables)

    // Transform subgraph responses to Poll types
    const polls: Poll[] = data.polls.map((poll) => ({
      id: poll.pollId,
      creator: poll.creator,
      question: poll.question,
      options: poll.options,
      createdAt: BigInt(poll.createdAt),
      expiresAt: BigInt(poll.expiresAt),
      rewardPool: BigInt(poll.rewardPool),
      isActive: poll.isActive,
      totalResponses: BigInt(poll.totalResponses),
      category: poll.category,
      projectId: BigInt(poll.projectId),
      votingType: poll.votingType,
      visibility: poll.visibility,
      status: parseInt(poll.status),
      platformFeeAmount: BigInt(poll.platformFeeAmount),
      claimedRewards: BigInt(poll.claimedRewards),
    }))

    return {
      polls,
      total: polls.length,
      hasMore: polls.length === limit,
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
    const data = await client.request<{ pollResponses: any[] }>(GET_USER_VOTES, {
      voter,
      first: limit,
      skip: offset,
    })

    // Transform poll responses to UserVote type
    return data.pollResponses.map((response) => ({
      pollId: response.pollId,
      optionId: response.optionIndex,
      timestamp: BigInt(response.timestamp),
      voter: response.respondent,
    }))
  } catch (error) {
    console.error('Error fetching user votes from subgraph:', error)
    return []
  }
}
