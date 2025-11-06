import type { Poll, PollOption } from '../types'
import { PollStatus } from '../types'

/**
 * Get the current status of a poll based on timestamps
 */
export function getPollStatus(poll: Poll): PollStatus {
  const now = BigInt(Math.floor(Date.now() / 1000))

  if (now < poll.startTime) {
    return 'not_started' as PollStatus.NotStarted
  }

  if (now > poll.endTime) {
    return 'ended' as PollStatus.Ended
  }

  return 'active' as PollStatus.Active
}

/**
 * Check if a poll is currently active and accepting votes
 */
export function isPollActive(poll: Poll): boolean {
  return getPollStatus(poll) === PollStatus.Active && poll.isActive
}

/**
 * Calculate the percentage of votes for each option
 */
export function calculateVotePercentages(options: PollOption[]): PollOption[] {
  const totalVotes = options.reduce((sum, option) => sum + option.voteCount, 0n)

  if (totalVotes === 0n) {
    return options.map((option) => ({ ...option, percentage: 0 }))
  }

  return options.map((option) => ({
    ...option,
    percentage: Number((option.voteCount * 100n) / totalVotes),
  }))
}

/**
 * Format a duration in seconds to a human-readable string
 */
export function formatDuration(seconds: bigint): string {
  const num = Number(seconds)
  const days = Math.floor(num / 86400)
  const hours = Math.floor((num % 86400) / 3600)
  const minutes = Math.floor((num % 3600) / 60)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`
  }
  return `${minutes} minute${minutes > 1 ? 's' : ''}`
}

/**
 * Format a timestamp to a human-readable date string
 */
export function formatTimestamp(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000)
  return date.toLocaleString()
}

/**
 * Get time remaining for a poll
 */
export function getTimeRemaining(endTime: bigint): {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
} {
  const now = Math.floor(Date.now() / 1000)
  const end = Number(endTime)
  const diff = end - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  return {
    days: Math.floor(diff / 86400),
    hours: Math.floor((diff % 86400) / 3600),
    minutes: Math.floor((diff % 3600) / 60),
    seconds: diff % 60,
    isExpired: false,
  }
}

/**
 * Truncate an Ethereum address for display
 */
export function truncateAddress(address: string, chars = 4): string {
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
}

/**
 * Convert seconds to a duration value
 */
export function toDuration(value: number, unit: 'minutes' | 'hours' | 'days'): bigint {
  const multipliers = {
    minutes: 60,
    hours: 3600,
    days: 86400,
  }
  return BigInt(value * multipliers[unit])
}
