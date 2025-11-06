import clsx from 'clsx'
import type { Poll } from '../core/types'
import { getPollStatus, formatTimestamp, truncateAddress } from '../core/utils'

export interface PollCardProps {
  poll: Poll
  onClick?: () => void
  className?: string
}

/**
 * PollCard component displays a poll preview card
 *
 * @example
 * ```tsx
 * <PollCard
 *   poll={poll}
 *   onClick={() => navigate(`/poll/${poll.id}`)}
 * />
 * ```
 */
export function PollCard({ poll, onClick, className }: PollCardProps) {
  const status = getPollStatus(poll)

  const statusStyles = {
    not_started: 'pp-bg-secondary/10 pp-text-secondary',
    active: 'pp-bg-success/10 pp-text-success',
    ended: 'pp-bg-muted pp-text-muted-foreground',
  }

  const statusLabels = {
    not_started: 'Not Started',
    active: 'Active',
    ended: 'Ended',
  }

  return (
    <div
      className={clsx('polypuls3-card', onClick && 'pp-cursor-pointer hover:pp-shadow-md', className)}
      onClick={onClick}
    >
      <div className="pp-flex pp-items-start pp-justify-between pp-mb-4">
        <div className="pp-flex-1">
          <h3 className="pp-text-lg pp-font-semibold pp-text-foreground pp-mb-1">
            {poll.question}
          </h3>
          <p className="pp-text-sm pp-text-muted-foreground">
            by {truncateAddress(poll.creator)}
          </p>
        </div>
        <span
          className={clsx(
            'pp-px-3 pp-py-1 pp-rounded-full pp-text-xs pp-font-medium',
            statusStyles[status]
          )}
        >
          {statusLabels[status]}
        </span>
      </div>

      {poll.category && (
        <p className="pp-text-sm pp-text-foreground pp-mb-4 pp-line-clamp-2">
          Category: {poll.category}
        </p>
      )}

      <div className="pp-flex pp-items-center pp-justify-between pp-text-xs pp-text-muted-foreground">
        <div className="pp-flex pp-items-center pp-gap-4">
          <span>
            {poll.options?.length || 0} option{poll.options?.length !== 1 ? 's' : ''}
          </span>
          <span>
            {poll.totalResponses.toString()} vote{poll.totalResponses !== 1n ? 's' : ''}
          </span>
        </div>
        <span>Ends {formatTimestamp(poll.expiresAt)}</span>
      </div>
    </div>
  )
}
