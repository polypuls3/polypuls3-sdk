import clsx from 'clsx'
import { usePollResults } from '../hooks/usePollResults'
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
  // Convert options to string array if needed
  const optionStrings: readonly string[] = Array.isArray(options)
    ? options.map((opt) => (typeof opt === 'string' ? opt : opt.text))
    : []

  const { results, totalVotes, isLoading, isError } = usePollResults({
    pollId,
    options: optionStrings,
    chainId,
  })

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
      {displayResults.map((option) => (
        <div key={option.id.toString()} className="pp-space-y-1">
          <div className="pp-flex pp-items-center pp-justify-between pp-text-sm">
            <span className="pp-font-medium pp-text-foreground">{option.text}</span>
            <div className="pp-flex pp-items-center pp-gap-2 pp-text-muted-foreground">
              {showVoteCount && (
                <span>
                  {option.voteCount.toString()} vote{option.voteCount !== 1n ? 's' : ''}
                </span>
              )}
              {showPercentage && (
                <span className="pp-font-semibold">{option.percentage?.toFixed(1)}%</span>
              )}
            </div>
          </div>
          <div className="pp-relative pp-h-8 pp-bg-muted pp-rounded-polypuls3 pp-overflow-hidden">
            <div
              className="pp-absolute pp-inset-y-0 pp-left-0 pp-bg-primary pp-transition-all pp-duration-500"
              style={{ width: `${option.percentage || 0}%` }}
            />
          </div>
        </div>
      ))}

      {totalVotes > 0n && (
        <div className="pp-text-sm pp-text-muted-foreground pp-text-center pp-pt-2">
          Total votes: {totalVotes.toString()}
        </div>
      )}
    </div>
  )
}
