import React from 'react'
import clsx from 'clsx'
import { useVote } from '../hooks/useVote'
import { useHasVoted } from '../hooks/useHasVoted'

export interface VoteButtonProps {
  pollId: bigint | string
  optionId: bigint | string
  onSuccess?: () => void
  onError?: (error: Error) => void
  children?: React.ReactNode
  className?: string
  disabled?: boolean
}

/**
 * VoteButton component handles voting on a poll option
 *
 * @example
 * ```tsx
 * <VoteButton
 *   pollId={1n}
 *   optionId={0n}
 *   onSuccess={() => alert('Vote successful!')}
 * >
 *   Vote for this option
 * </VoteButton>
 * ```
 */
export function VoteButton({
  pollId,
  optionId,
  onSuccess,
  onError,
  children = 'Vote',
  className,
  disabled,
}: VoteButtonProps) {
  const { vote, isPending, isSuccess, isError, error } = useVote()
  const { hasVoted } = useHasVoted({ pollId })

  React.useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess()
    }
  }, [isSuccess, onSuccess])

  React.useEffect(() => {
    if (isError && error && onError) {
      onError(error)
    }
  }, [isError, error, onError])

  const handleVote = () => {
    if (!hasVoted && !isPending) {
      vote({ pollId, optionId })
    }
  }

  const isDisabled = disabled || isPending || hasVoted

  return (
    <button
      onClick={handleVote}
      disabled={isDisabled}
      className={clsx('polypuls3-button polypuls3-button-primary', className)}
    >
      {isPending ? 'Voting...' : hasVoted ? 'Voted' : children}
    </button>
  )
}
