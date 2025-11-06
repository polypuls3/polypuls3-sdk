import clsx from 'clsx'
import { usePoll } from '../hooks/usePoll'
import { useHasVoted } from '../hooks/useHasVoted'
import { PollResults } from './PollResults'
import { VoteButton } from './VoteButton'
import { getPollStatus, formatTimestamp, getTimeRemaining } from '../core/utils'

export interface PollWidgetProps {
  pollId: bigint | string
  chainId?: number
  className?: string
  onVoteSuccess?: () => void
  onVoteError?: (error: Error) => void
  showResults?: boolean // Force show results
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
}: PollWidgetProps) {
  const { poll, isLoading, isError, error, refetch } = usePoll({ pollId, chainId })
  const { hasVoted, userVote } = useHasVoted({ pollId, chainId })

  // Auto-refetch on vote success
  const handleVoteSuccess = () => {
    refetch()
    onVoteSuccess?.()
  }

  if (isLoading) {
    return (
      <div className={clsx('polypuls3-card pp-animate-pulse', className)}>
        <div className="pp-h-6 pp-bg-muted pp-rounded pp-mb-4"></div>
        <div className="pp-h-4 pp-bg-muted pp-rounded pp-mb-2"></div>
        <div className="pp-h-4 pp-bg-muted pp-rounded pp-w-2/3 pp-mb-6"></div>
        <div className="pp-space-y-3">
          <div className="pp-h-10 pp-bg-muted pp-rounded"></div>
          <div className="pp-h-10 pp-bg-muted pp-rounded"></div>
        </div>
      </div>
    )
  }

  if (isError || !poll) {
    return (
      <div className={clsx('polypuls3-card pp-text-error', className)}>
        <p>Error loading poll: {error?.message || 'Poll not found'}</p>
      </div>
    )
  }

  const status = getPollStatus(poll)
  const timeRemaining = getTimeRemaining(poll.endTime)
  const shouldShowResults = showResults || hasVoted || status === 'ended'

  return (
    <div className={clsx('polypuls3-card', className)}>
      {/* Header */}
      <div className="pp-mb-4">
        <div className="pp-flex pp-items-start pp-justify-between pp-mb-2">
          <h2 className="pp-text-2xl pp-font-bold pp-text-foreground">{poll.title}</h2>
          <span
            className={clsx(
              'pp-px-3 pp-py-1 pp-rounded-full pp-text-xs pp-font-medium',
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
        <p className="pp-text-foreground pp-mb-3">{poll.description}</p>

        {/* Time info */}
        <div className="pp-text-sm pp-text-muted-foreground">
          {status === 'active' && !timeRemaining.isExpired && (
            <p>
              Ends in {timeRemaining.days > 0 && `${timeRemaining.days}d `}
              {timeRemaining.hours}h {timeRemaining.minutes}m
            </p>
          )}
          {status === 'ended' && <p>Ended {formatTimestamp(poll.endTime)}</p>}
          {status === 'not_started' && <p>Starts {formatTimestamp(poll.startTime)}</p>}
        </div>
      </div>

      {/* Results or Voting Interface */}
      {shouldShowResults ? (
        <div>
          <h3 className="pp-text-lg pp-font-semibold pp-mb-3">Results</h3>
          {hasVoted && userVote !== undefined && (
            <p className="pp-text-sm pp-text-success pp-mb-3">
              You voted for option {userVote.toString()}
            </p>
          )}
          <PollResults
            pollId={pollId}
            optionCount={poll.options?.length || 0}
            options={poll.options}
            chainId={chainId}
            showVoteCount
            showPercentage
          />
        </div>
      ) : (
        <div>
          <h3 className="pp-text-lg pp-font-semibold pp-mb-3">Cast your vote</h3>
          <div className="pp-space-y-2">
            {poll.options?.map((option) => (
              <div
                key={option.id.toString()}
                className="pp-flex pp-items-center pp-justify-between pp-p-4 pp-border pp-border-border pp-rounded-polypuls3 hover:pp-border-primary pp-transition-colors"
              >
                <span className="pp-text-foreground">{option.text}</span>
                <VoteButton
                  pollId={pollId}
                  optionId={option.id}
                  onSuccess={handleVoteSuccess}
                  onError={onVoteError}
                  disabled={status !== 'active'}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
