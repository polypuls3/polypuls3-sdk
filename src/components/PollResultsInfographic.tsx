import { useState, useEffect } from 'react'
import clsx from 'clsx'
import type { PollOption } from '../core/types'
import type { InfographicStyle } from '../core/types'

export interface PollResultsInfographicProps {
  results: PollOption[]
  totalVotes: bigint
  leadingOptionId: string | bigint | null
  style?: InfographicStyle
  showVoteCount?: boolean
  showPercentage?: boolean
  className?: string
  isPremium?: boolean
}

/**
 * PollResultsInfographic component displays poll results as styled infographics
 * Supports three styles: icons, leaderboard, cards
 *
 * @example
 * ```tsx
 * <PollResultsInfographic
 *   results={results}
 *   totalVotes={100n}
 *   leadingOptionId={0}
 *   style="leaderboard"
 * />
 * ```
 */
export function PollResultsInfographic({
  results,
  totalVotes,
  leadingOptionId,
  style = 'leaderboard',
  showVoteCount = true,
  showPercentage = true,
  className,
  isPremium = false,
}: PollResultsInfographicProps) {
  // Sort results by vote count for leaderboard
  const sortedResults = [...results].sort((a, b) => {
    const aVotes = Number(a.voteCount)
    const bVotes = Number(b.voteCount)
    return bVotes - aVotes
  })

  if (style === 'icons') {
    return <IconsView results={results} totalVotes={totalVotes} leadingOptionId={leadingOptionId} showVoteCount={showVoteCount} showPercentage={showPercentage} className={className} isPremium={isPremium} />
  }

  if (style === 'cards') {
    return <CardsView results={results} totalVotes={totalVotes} leadingOptionId={leadingOptionId} showVoteCount={showVoteCount} showPercentage={showPercentage} className={className} isPremium={isPremium} />
  }

  // Default: leaderboard
  return <LeaderboardView results={sortedResults} totalVotes={totalVotes} leadingOptionId={leadingOptionId} showVoteCount={showVoteCount} showPercentage={showPercentage} className={className} isPremium={isPremium} />
}

// Icons View: Display votes as icon arrays
function IconsView({ results, totalVotes, leadingOptionId, showVoteCount, showPercentage, className, isPremium }: Omit<PollResultsInfographicProps, 'style'>) {
  // Icon to represent votes
  const voteIcon = '🟣'

  // Scale factor to keep icons manageable
  const getIconCount = (voteCount: bigint) => {
    const count = Number(voteCount)
    if (totalVotes === 0n) return 0
    // Show max 20 icons, scaled proportionally
    const maxIcons = 20
    return Math.max(1, Math.ceil((count / Number(totalVotes)) * maxIcons))
  }

  return (
    <div className={clsx('pp-space-y-4', className)}>
      {results.map((option) => {
        const isLeading = option.id === leadingOptionId && totalVotes > 0n
        const iconCount = getIconCount(option.voteCount)

        return (
          <div
            key={option.id.toString()}
            className="pp-infographic-icon-row pp-p-4 pp-bg-muted/30 pp-rounded-polypuls3 pp-border pp-border-border"
          >
            <div className="pp-flex pp-items-center pp-justify-between pp-mb-2">
              <div className="pp-flex pp-items-center pp-gap-2">
                <span className={clsx(
                  'pp-font-semibold pp-text-sm',
                  isLeading && isPremium ? 'pp-text-success' : 'pp-text-foreground'
                )}>
                  {option.text}
                </span>
                {isLeading && isPremium && (
                  <span title="Leading">👑</span>
                )}
              </div>
              <div className="pp-flex pp-items-center pp-gap-2 pp-text-xs pp-text-muted-foreground">
                {showVoteCount && <span>{option.voteCount.toString()} votes</span>}
                {showPercentage && (
                  <span className={clsx(
                    'pp-font-semibold',
                    isLeading && isPremium && 'pp-text-success'
                  )}>
                    {option.percentage?.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div className="pp-flex pp-flex-wrap pp-gap-1">
              {Array.from({ length: iconCount }).map((_, i) => (
                <span key={i} className="pp-text-lg">{voteIcon}</span>
              ))}
            </div>
          </div>
        )
      })}

      <div className="pp-text-sm pp-text-muted-foreground pp-text-center pp-pt-2 pp-border-t pp-border-border">
        Total votes: {totalVotes.toString()}
      </div>
    </div>
  )
}

// Leaderboard View: Ranked list with medals
function LeaderboardView({ results, totalVotes, leadingOptionId, showVoteCount, showPercentage, className, isPremium }: Omit<PollResultsInfographicProps, 'style'>) {
  const getMedal = (rank: number) => {
    if (rank === 0) return '🥇'
    if (rank === 1) return '🥈'
    if (rank === 2) return '🥉'
    return null
  }

  return (
    <div className={clsx('pp-space-y-2', className)}>
      {results.map((option, index) => {
        const isLeading = option.id === leadingOptionId && totalVotes > 0n
        const medal = getMedal(index)
        const rank = index + 1

        return (
          <div
            key={option.id.toString()}
            className={clsx(
              'pp-infographic-leaderboard-row pp-p-4 pp-rounded-polypuls3 pp-border pp-transition-all',
              isLeading && isPremium
                ? 'pp-bg-success/10 pp-border-success/50'
                : 'pp-bg-muted/30 pp-border-border'
            )}
          >
            <div className="pp-flex pp-items-center pp-gap-3">
              {/* Rank/Medal */}
              <div className="pp-flex pp-items-center pp-justify-center pp-w-10 pp-h-10 pp-rounded-full pp-bg-background pp-border pp-border-border">
                {medal ? (
                  <span className="pp-text-2xl">{medal}</span>
                ) : (
                  <span className="pp-text-sm pp-font-bold pp-text-muted-foreground">#{rank}</span>
                )}
              </div>

              {/* Option name and stats */}
              <div className="pp-flex-1">
                <div className="pp-flex pp-items-center pp-gap-2 pp-mb-1">
                  <span className={clsx(
                    'pp-font-semibold',
                    isLeading && isPremium ? 'pp-text-success' : 'pp-text-foreground'
                  )}>
                    {option.text}
                  </span>
                  {isLeading && isPremium && (
                    <span className="pp-text-success" title="Leading">👑</span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="pp-relative pp-h-2 pp-bg-muted pp-rounded-full pp-overflow-hidden">
                  <div
                    className={clsx(
                      'pp-progress-bar pp-h-full pp-rounded-full',
                      isLeading && isPremium && 'pp-progress-bar-leader'
                    )}
                    style={{ width: `${option.percentage || 0}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="pp-flex pp-flex-col pp-items-end pp-gap-1">
                {showVoteCount && (
                  <span className="pp-text-sm pp-font-medium pp-text-foreground">
                    {option.voteCount.toString()}
                  </span>
                )}
                {showPercentage && (
                  <span className={clsx(
                    'pp-text-xs pp-font-semibold',
                    isLeading && isPremium ? 'pp-text-success' : 'pp-text-muted-foreground'
                  )}>
                    {option.percentage?.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}

      <div className="pp-text-sm pp-text-muted-foreground pp-text-center pp-pt-2 pp-border-t pp-border-border">
        Total votes: {totalVotes.toString()}
      </div>
    </div>
  )
}

// Cards View: Animated stat cards
function CardsView({ results, totalVotes, leadingOptionId, showVoteCount, showPercentage, className, isPremium }: Omit<PollResultsInfographicProps, 'style'>) {
  const [animatedCounts, setAnimatedCounts] = useState<Record<string, number>>({})

  // Animate vote counts on mount
  useEffect(() => {
    results.forEach((option) => {
      const targetCount = Number(option.voteCount)
      const optionId = option.id.toString()

      // Animate from 0 to target
      let currentCount = 0
      const duration = 1000 // 1 second
      const steps = 30
      const increment = targetCount / steps
      const stepDuration = duration / steps

      const interval = setInterval(() => {
        currentCount += increment
        if (currentCount >= targetCount) {
          setAnimatedCounts((prev) => ({ ...prev, [optionId]: targetCount }))
          clearInterval(interval)
        } else {
          setAnimatedCounts((prev) => ({ ...prev, [optionId]: Math.floor(currentCount) }))
        }
      }, stepDuration)
    })
  }, [results])

  return (
    <div className={clsx('pp-grid pp-grid-cols-1 md:pp-grid-cols-2 pp-gap-4', className)}>
      {results.map((option) => {
        const isLeading = option.id === leadingOptionId && totalVotes > 0n
        const animatedCount = animatedCounts[option.id.toString()] || 0

        return (
          <div
            key={option.id.toString()}
            className={clsx(
              'pp-infographic-card pp-p-6 pp-rounded-polypuls3 pp-border pp-transition-all pp-duration-300',
              isPremium && 'hover:pp-scale-105',
              isLeading && isPremium
                ? 'pp-bg-success/10 pp-border-success/50'
                : 'pp-bg-muted/30 pp-border-border'
            )}
          >
            {/* Option name */}
            <div className="pp-flex pp-items-center pp-justify-between pp-mb-4">
              <h4 className={clsx(
                'pp-font-semibold pp-text-lg',
                isLeading && isPremium ? 'pp-text-success' : 'pp-text-foreground'
              )}>
                {option.text}
              </h4>
              {isLeading && isPremium && (
                <span className="pp-text-2xl" title="Leading">👑</span>
              )}
            </div>

            {/* Vote count (animated) */}
            {showVoteCount && (
              <div className="pp-text-4xl pp-font-bold pp-text-foreground pp-mb-2">
                {animatedCount.toLocaleString()}
              </div>
            )}

            {/* Percentage badge */}
            {showPercentage && (
              <div className={clsx(
                'pp-inline-block pp-px-3 pp-py-1 pp-rounded-full pp-text-sm pp-font-semibold',
                isLeading && isPremium
                  ? 'pp-bg-success/20 pp-text-success'
                  : 'pp-bg-primary/20 pp-text-primary'
              )}>
                {option.percentage?.toFixed(1)}%
              </div>
            )}

            {/* Progress indicator */}
            <div className="pp-mt-4 pp-relative pp-h-1 pp-bg-muted pp-rounded-full pp-overflow-hidden">
              <div
                className={clsx(
                  'pp-progress-bar pp-h-full pp-rounded-full',
                  isLeading && isPremium && 'pp-progress-bar-leader'
                )}
                style={{ width: `${option.percentage || 0}%` }}
              />
            </div>
          </div>
        )
      })}

      {/* Total votes card */}
      <div className="md:pp-col-span-2 pp-text-sm pp-text-muted-foreground pp-text-center pp-pt-4 pp-border-t pp-border-border">
        Total votes: {totalVotes.toString()}
      </div>
    </div>
  )
}
