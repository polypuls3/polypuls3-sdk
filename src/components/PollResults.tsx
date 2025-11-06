import clsx from 'clsx'
import { usePollResults } from '../hooks/usePollResults'
import type { PollOption } from '../core/types'

export interface PollResultsProps {
  pollId: bigint | string
  optionCount: number
  options?: PollOption[] // Optional: provide option text
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
 *   optionCount={3}
 *   options={[
 *     { id: 0n, text: 'Option A', voteCount: 0n },
 *     { id: 1n, text: 'Option B', voteCount: 0n },
 *     { id: 2n, text: 'Option C', voteCount: 0n },
 *   ]}
 *   showVoteCount
 *   showPercentage
 * />
 * ```
 */
export function PollResults({
  pollId,
  optionCount,
  options,
  chainId,
  className,
  showVoteCount = true,
  showPercentage = true,
}: PollResultsProps) {
  const { results, totalVotes, isLoading, isError } = usePollResults({
    pollId,
    optionCount,
    chainId,
  })

  if (isLoading) {
    return (
      <div className={clsx('pp-space-y-3', className)}>
        {Array.from({ length: optionCount }).map((_, i) => (
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

  // Merge with provided options to get text
  const displayResults = results.map((result) => {
    const optionData = options?.find((opt) => opt.id === result.id)
    return {
      ...result,
      text: optionData?.text || result.text,
    }
  })

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
