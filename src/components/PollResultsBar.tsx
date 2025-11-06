import clsx from 'clsx'
import type { PollOption } from '../core/types'
import type { BarOrientation } from '../core/types'

export interface PollResultsBarProps {
  results: PollOption[]
  totalVotes: bigint
  leadingOptionId: string | bigint | null
  showVoteCount?: boolean
  showPercentage?: boolean
  orientation?: BarOrientation
  className?: string
  isPremium?: boolean
}

/**
 * PollResultsBar component displays poll results as horizontal or vertical bars
 *
 * @example
 * ```tsx
 * <PollResultsBar
 *   results={results}
 *   totalVotes={100n}
 *   leadingOptionId={0}
 *   orientation="horizontal"
 * />
 * ```
 */
export function PollResultsBar({
  results,
  totalVotes,
  leadingOptionId,
  showVoteCount = true,
  showPercentage = true,
  orientation = 'horizontal',
  className,
  isPremium = false,
}: PollResultsBarProps) {
  if (orientation === 'vertical') {
    // Vertical bar chart layout
    return (
      <div className={clsx('pp-flex pp-flex-col pp-gap-4', className)}>
        {/* Chart area */}
        <div className="pp-flex pp-items-end pp-justify-around pp-h-64 pp-gap-2">
          {results.map((option) => {
            const isLeading = option.id === leadingOptionId && totalVotes > 0n
            const height = option.percentage || 0

            return (
              <div key={option.id.toString()} className="pp-flex pp-flex-col pp-items-center pp-flex-1">
                {/* Bar */}
                <div className="pp-w-full pp-relative pp-flex pp-flex-col pp-justify-end" style={{ height: '100%' }}>
                  {showPercentage && (
                    <div
                      className={clsx(
                        'pp-text-xs pp-font-semibold pp-text-center pp-mb-1',
                        isLeading && isPremium ? 'pp-text-success' : 'pp-text-foreground'
                      )}
                    >
                      {option.percentage?.toFixed(1)}%
                    </div>
                  )}
                  <div
                    className={clsx(
                      'pp-progress-bar pp-w-full pp-rounded-t-polypuls3 pp-transition-all pp-duration-300',
                      isLeading && isPremium && 'pp-progress-bar-leader'
                    )}
                    style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                  />
                </div>

                {/* Label */}
                <div className="pp-mt-2 pp-text-xs pp-text-center pp-break-words pp-w-full">
                  <div className={clsx(
                    'pp-font-medium pp-mb-1',
                    isLeading && isPremium ? 'pp-text-success' : 'pp-text-foreground'
                  )}>
                    {option.text}
                    {isLeading && isPremium && ' 👑'}
                  </div>
                  {showVoteCount && (
                    <div className="pp-text-muted-foreground">
                      {option.voteCount.toString()}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Total votes */}
        {totalVotes > 0n && (
          <div className="pp-text-sm pp-text-muted-foreground pp-text-center pp-pt-2 pp-border-t pp-border-border">
            Total votes: {totalVotes.toString()}
          </div>
        )}
      </div>
    )
  }

  // Horizontal bar chart layout (default)
  return (
    <div className={clsx('pp-space-y-3', className)}>
      {results.map((option) => {
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
