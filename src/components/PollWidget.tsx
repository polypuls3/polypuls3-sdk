import clsx from 'clsx'
import { usePoll } from '../hooks/usePoll'
import { useHasVoted } from '../hooks/useHasVoted'
import { usePolyPulseConfig } from '../providers'
import { PollResults } from './PollResults'
import { VoteButton } from './VoteButton'
import { getPollStatus, formatTimestamp, getTimeRemaining } from '../core/utils'
import type { WidgetSize } from '../core/config/theme'

export interface PollWidgetProps {
  pollId: bigint | string
  chainId?: number
  className?: string
  onVoteSuccess?: () => void
  onVoteError?: (error: Error) => void
  showResults?: boolean // Force show results
  size?: WidgetSize // Override global size
}

/**
 * PollWidget component - A complete poll display with voting functionality
 *
 * @example
 * ```tsx
 * <PollWidget
 *   pollId={1n}
 *   onVoteSuccess={() => toast.success('Vote recorded!')}
 *   onVoteError={(error) => toast.error(error.message)}
 * />
 * ```
 */
export function PollWidget({
  pollId,
  chainId,
  className,
  onVoteSuccess,
  onVoteError,
  showResults = false,
  size,
}: PollWidgetProps) {
  const { themeConfig } = usePolyPulseConfig()
  const { poll, isLoading, isError, error, refetch } = usePoll({ pollId, chainId })
  const { hasVoted, userVote } = useHasVoted({ pollId, chainId })

  // Use provided size or fall back to global theme size
  const effectiveSize = size ?? themeConfig.size ?? 'medium'

  // Auto-refetch on vote success
  const handleVoteSuccess = () => {
    refetch()
    onVoteSuccess?.()
  }

  if (isLoading) {
    return (
      <div className={`pp-size-${effectiveSize}`}>
        <div className={clsx('polypuls3-card pp-animate-pulse', className)}>
          <div className="pp-h-6 pp-bg-muted pp-rounded pp-mb-4"></div>
          <div className="pp-h-4 pp-bg-muted pp-rounded pp-mb-2"></div>
          <div className="pp-h-4 pp-bg-muted pp-rounded pp-w-2/3 pp-mb-6"></div>
          <div className="pp-space-y-3">
            <div className="pp-h-10 pp-bg-muted pp-rounded"></div>
            <div className="pp-h-10 pp-bg-muted pp-rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !poll) {
    return (
      <div className={`pp-size-${effectiveSize}`}>
        <div className={clsx('polypuls3-card pp-text-error', className)}>
          <p className="pp-widget-body">Error loading poll: {error?.message || 'Poll not found'}</p>
        </div>
      </div>
    )
  }

  const status = getPollStatus(poll)
  const timeRemaining = getTimeRemaining(poll.expiresAt)
  const shouldShowResults = showResults || hasVoted || status === 'ended'

  return (
    <div className={`pp-size-${effectiveSize}`}>
      <div className={clsx('polypuls3-card', className)}>
        {/* Header */}
        <div className="pp-mb-4">
          <div className="pp-flex pp-items-start pp-justify-between pp-mb-2">
            <h2 className="pp-widget-title pp-text-foreground">{poll.question}</h2>
            <span
              className={clsx(
                'pp-status-badge pp-rounded-full pp-font-medium',
                status === 'active' && 'pp-bg-success/10 pp-text-success',
                status === 'ended' && 'pp-bg-muted pp-text-muted-foreground',
                status === 'not_started' && 'pp-bg-secondary/10 pp-text-secondary'
              )}
            >
              {status === 'active' && 'Active'}
              {status === 'ended' && 'Ended'}
              {status === 'not_started' && 'Not Started'}
            </span>
          </div>
        {poll.category && (
          <p className="pp-widget-body pp-text-foreground pp-mb-3">Category: {poll.category}</p>
        )}

        {/* Time info */}
        <div className="pp-widget-body pp-text-muted-foreground">
          {status === 'active' && !timeRemaining.isExpired && (
            <p>
              Ends in {timeRemaining.days > 0 && `${timeRemaining.days}d `}
              {timeRemaining.hours}h {timeRemaining.minutes}m
            </p>
          )}
          {status === 'ended' && <p>Ended {formatTimestamp(poll.expiresAt)}</p>}
          {status === 'not_started' && <p>Created {formatTimestamp(poll.createdAt)}</p>}
        </div>
      </div>

      {/* Results or Voting Interface */}
      {shouldShowResults ? (
        <div className="pp-widget-spacing">
          <h3 className="pp-widget-heading">Results</h3>
          {hasVoted && userVote !== undefined && (
            <p className="pp-widget-body pp-text-success pp-mb-3">
              You voted for option {userVote.toString()}
            </p>
          )}
          <PollResults
            pollId={pollId}
            options={poll.options as readonly string[]}
            chainId={chainId}
            showVoteCount
            showPercentage
          />
        </div>
      ) : (
        <div className="pp-widget-spacing">
          <h3 className="pp-widget-heading">Cast your vote</h3>
          <div className="pp-widget-spacing">
            {poll.options?.map((option, index) => {
              const optionText = typeof option === 'string' ? option : option.text
              return (
                <div
                  key={index}
                  className="pp-vote-option pp-flex pp-items-center pp-justify-between pp-border pp-border-border pp-rounded-polypuls3 hover:pp-border-primary pp-transition-colors"
                >
                  <span className="pp-vote-option-text pp-text-foreground">{optionText}</span>
                  <VoteButton
                    pollId={pollId}
                    optionId={BigInt(index)}
                    onSuccess={handleVoteSuccess}
                    onError={onVoteError}
                    disabled={status !== 'active'}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
