import clsx from 'clsx'
import { usePollResults } from '../hooks/usePollResults'
import { useTheme } from '../hooks/useTheme'
import type { PollOption } from '../core/types'

export interface PollResultsProps {
  pollId: bigint | string
  options: readonly string[] | PollOption[] // Array of option texts or PollOption objects
  chainId?: number
  className?: string
  showVoteCount?: boolean
  showPercentage?: boolean
}

/**
 * PollResults component displays poll voting results with visual bars
 *
 * @example
 * ```tsx
 * <PollResults
 *   pollId={1n}
 *   options={['Option A', 'Option B', 'Option C']}
 *   showVoteCount
 *   showPercentage
 * />
 * ```
 */
export function PollResults({
  pollId,
  options,
  chainId,
  className,
  showVoteCount = true,
  showPercentage = true,
}: PollResultsProps) {
  const { isPremium } = useTheme()

  // Convert options to string array if needed
  const optionStrings: readonly string[] = Array.isArray(options)
    ? options.map((opt) => (typeof opt === 'string' ? opt : opt.text))
    : []

  const { results, totalVotes, isLoading, isError } = usePollResults({
    pollId,
    options: optionStrings,
    chainId,
  })

  // Find the leading option (highest percentage)
  const leadingOptionId = results.length > 0
    ? results.reduce((prev, current) =>
        (current.percentage || 0) > (prev.percentage || 0) ? current : prev
      ).id
    : null

  if (isLoading) {
    return (
      <div className={clsx('pp-space-y-3', className)}>
        {Array.from({ length: options?.length || 3 }).map((_, i) => (
          <div key={i} className="pp-animate-pulse">
            <div className="pp-h-4 pp-bg-muted pp-rounded pp-mb-2"></div>
            <div className="pp-h-8 pp-bg-muted pp-rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className={clsx('pp-text-error pp-text-sm', className)}>
        Error loading results
      </div>
    )
  }

  // The results already have text from the options array
  const displayResults = results

  return (
    <div className={clsx('pp-space-y-3', className)}>
      {displayResults.map((option) => {
        const isLeading = option.id === leadingOptionId && totalVotes > 0n

        return (
          <div key={option.id.toString()} className="pp-space-y-1">
            <div className="pp-flex pp-items-center pp-justify-between pp-text-sm">
              <div className="pp-flex pp-items-center pp-gap-2">
                <span className={clsx(
                  'pp-font-medium',
                  isLeading && isPremium ? 'pp-text-success' : 'pp-text-foreground'
                )}>
                  {option.text}
                </span>
                {isLeading && isPremium && (
                  <span className="pp-text-success" title="Leading">
                    👑
                  </span>
                )}
              </div>
              <div className="pp-flex pp-items-center pp-gap-2 pp-text-muted-foreground">
                {showVoteCount && (
                  <span>
                    {option.voteCount.toString()} vote{option.voteCount !== 1n ? 's' : ''}
                  </span>
                )}
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
            <div className="pp-relative pp-h-8 pp-bg-muted pp-rounded-polypuls3 pp-overflow-hidden">
              <div
                className={clsx(
                  'pp-progress-bar',
                  isLeading && isPremium && 'pp-progress-bar-leader',
                  'pp-absolute pp-inset-y-0 pp-left-0'
                )}
                style={{ width: `${option.percentage || 0}%` }}
              />
            </div>
          </div>
        )
      })}

      {totalVotes > 0n && (
        <div className="pp-text-sm pp-text-muted-foreground pp-text-center pp-pt-2">
          Total votes: {totalVotes.toString()}
        </div>
      )}
    </div>
  )
}
