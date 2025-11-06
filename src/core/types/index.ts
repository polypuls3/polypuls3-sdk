import type { Address } from 'viem'

/**
 * Represents a poll in the Polypuls3 system
 * Matches PolyPuls3Poll contract structure
 */
export interface Poll {
  id: string | bigint
  creator: Address
  question: string // Poll question (contract uses 'question' not 'title')
  options: readonly string[] | PollOption[] // Array of option strings
  createdAt: bigint // Unix timestamp when poll was created
  expiresAt: bigint // Unix timestamp when poll expires
  rewardPool: bigint // Total reward pool for the poll
  isActive: boolean
  totalResponses: bigint // Number of responses/votes
  category: string
  projectId: bigint
  votingType: string
  visibility: string
  status: number // PollStatus enum (0-5)
  platformFeeAmount: bigint
  claimedRewards: bigint
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
  projectId?: number
  tags?: string[]
  imageUrl?: string
  externalUrl?: string
}

/**
 * Parameters for creating a new poll
 * Note: Matches PolyPuls3Poll.createPoll function signature
 */
export interface CreatePollParams {
  title: string // Poll question
  description?: string // Not used in contract, kept for backwards compatibility
  options: string[] // Array of option texts
  duration: bigint // Duration in days (not seconds!)
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
