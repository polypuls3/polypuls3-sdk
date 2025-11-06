import { useState, useRef } from 'react'
import clsx from 'clsx'
import { usePoll } from '../hooks/usePoll'
import { useHasVoted } from '../hooks/useHasVoted'
import { usePolyPulseConfig } from '../providers'
import { PollResults } from './PollResults'
import { VoteButton } from './VoteButton'
import { getPollStatus, formatTimestamp, getTimeRemaining, celebrateVote } from '../core/utils'
import type { WidgetSize } from '../core/config/theme'
import type { DisplayMode, ChartType, InfographicStyle, BarOrientation } from '../core/types'

export interface PollWidgetProps {
  pollId: bigint | string
  chainId?: number
  className?: string
  onVoteSuccess?: () => void
  onVoteError?: (error: Error) => void
  showResults?: boolean // Show/hide results data (default: true)
  size?: WidgetSize // Override global size
  displayMode?: DisplayMode // Control UI structure (default: 'mixed')
  resultsHiddenMessage?: string // Custom message when results hidden
  showSuccessBanner?: boolean // Show success banner on vote (default: true)
  successMessage?: string // Custom success message
  successDuration?: number // Banner duration in ms (default: 3000)
  enableConfetti?: boolean // Override theme confetti setting
  chartType?: ChartType // Chart visualization type (bar, pie, infographic)
  barOrientation?: BarOrientation // Bar chart orientation (horizontal, vertical)
  infographicStyle?: InfographicStyle // Infographic style (icons, leaderboard, cards)
  chartColors?: string[] // Custom colors for charts
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
  showResults,
  size,
  displayMode,
  resultsHiddenMessage,
  showSuccessBanner,
  successMessage,
  successDuration,
  enableConfetti,
  chartType,
  barOrientation,
  infographicStyle,
  chartColors,
}: PollWidgetProps) {
  const { themeConfig } = usePolyPulseConfig()
  const { poll, isLoading, isError, error, refetch } = usePoll({ pollId, chainId })
  const { hasVoted, userVote } = useHasVoted({ pollId, chainId })

  // State for success banner
  const [showSuccess, setShowSuccess] = useState(false)

  // Canvas ref for constrained confetti
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)

  // Use provided size or fall back to global theme size
  const effectiveSize = size ?? themeConfig.size ?? 'medium'

  // Auto-refetch on vote success + show effects
  const handleVoteSuccess = () => {
    refetch()

    // Show success banner
    if (showSuccessBanner !== false) {
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, successDuration ?? 3000)
    }

    // Confetti celebration
    const shouldShowConfetti = enableConfetti ?? themeConfig.effects?.enableConfetti ?? false
    if (shouldShowConfetti) {
      celebrateVote(themeConfig.effects?.confettiConfig, confettiCanvasRef.current)
    }

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

  // Determine display mode and results visibility
  const effectiveMode = displayMode ?? 'mixed'
  const shouldShowResultsData = showResults ?? true

  // Determine which interface to display based on mode
  const getDisplayInterface = (mode: DisplayMode, hasVoted: boolean, status: string): 'vote' | 'result' => {
    if (mode === 'vote') {
      // Vote mode: show voting UNTIL user votes, then switch to result
      if (hasVoted || status === 'ended') {
        return 'result'
      }
      return 'vote'
    }

    if (mode === 'result') {
      // Always show result interface
      return 'result'
    }

    // mixed mode: auto-switch based on vote status (current behavior)
    if (hasVoted || status === 'ended') {
      return 'result'
    }
    return 'vote'
  }

  const displayInterface = getDisplayInterface(effectiveMode, hasVoted, status)
  const showActualResults = shouldShowResultsData && displayInterface === 'result'

  return (
    <div className={`pp-size-${effectiveSize}`}>
      <div className={clsx('polypuls3-card', 'pp-confetti-container', className)}>
        {/* Confetti Canvas */}
        <canvas
          ref={confettiCanvasRef}
          className="pp-confetti-canvas"
          aria-hidden="true"
        />

        {/* Success Banner */}
        {showSuccess && (
          <div className="pp-success-banner pp-animate-slide-in">
            <svg className="pp-success-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="pp-widget-body">{successMessage ?? "Vote submitted successfully!"}</span>
          </div>
        )}

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
      {displayInterface === 'result' ? (
        <div className="pp-widget-spacing">
          <h3 className="pp-widget-heading">Results</h3>

          {hasVoted && userVote !== undefined && (
            <p className="pp-widget-body pp-text-success pp-mb-3">
              You voted for option {userVote.toString()}
            </p>
          )}

          {showActualResults ? (
            // Show actual results with vote counts and percentages
            <PollResults
              pollId={pollId}
              options={poll.options as readonly string[]}
              chainId={chainId}
              showVoteCount
              showPercentage
              chartType={chartType}
              barOrientation={barOrientation}
              infographicStyle={infographicStyle}
              chartColors={chartColors}
            />
          ) : (
            // Show message without revealing results data
            <div className="pp-p-4 pp-bg-muted/50 pp-rounded-polypuls3 pp-text-center">
              <p className="pp-widget-body pp-text-muted-foreground">
                {resultsHiddenMessage ??
                  (hasVoted
                    ? "Thank you for voting! Results are hidden for this poll."
                    : status === 'ended'
                    ? "This poll has ended. Results are not publicly available."
                    : "Results will be available after you vote."
                  )
                }
              </p>
            </div>
          )}
        </div>
      ) : (
        // Vote interface
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
