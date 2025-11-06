import type { Address } from 'viem'

/**
 * Represents a poll in the Polypuls3 system
 */
export interface Poll {
  id: string | bigint
  creator: Address
  title: string
  description: string
  options: PollOption[]
  startTime: bigint
  endTime: bigint
  isActive: boolean
  totalVotes?: bigint
  createdAt?: bigint
  metadata?: PollMetadata
}

/**
 * Represents a poll option
 */
export interface PollOption {
  id: string | bigint
  text: string
  voteCount: bigint
  percentage?: number
}

/**
 * Additional metadata for a poll (optional, can be stored off-chain)
 */
export interface PollMetadata {
  category?: string
  tags?: string[]
  imageUrl?: string
  externalUrl?: string
}

/**
 * Parameters for creating a new poll
 */
export interface CreatePollParams {
  title: string
  description: string
  options: string[]
  duration: bigint // Duration in seconds
  metadata?: PollMetadata
}

/**
 * Parameters for voting on a poll
 */
export interface VoteParams {
  pollId: string | bigint
  optionId: string | bigint
}

/**
 * Represents a user's vote
 */
export interface UserVote {
  pollId: string | bigint
  optionId: string | bigint
  timestamp: bigint
  voter: Address
}

/**
 * Poll status enum
 */
export enum PollStatus {
  NotStarted = 'not_started',
  Active = 'active',
  Ended = 'ended',
}

/**
 * Filter options for fetching polls
 */
export interface PollFilters {
  creator?: Address
  status?: PollStatus
  category?: string
  tags?: string[]
  limit?: number
  offset?: number
}

/**
 * Result of a poll query with pagination
 */
export interface PollsQueryResult {
  polls: Poll[]
  total: number
  hasMore: boolean
}

/**
 * Transaction status for write operations
 */
export type TransactionStatus = 'idle' | 'preparing' | 'pending' | 'success' | 'error'

/**
 * Error type for SDK operations
 */
export interface Polypuls3Error extends Error {
  code: string
  details?: unknown
}
