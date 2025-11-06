import React, { useState } from 'react'
import clsx from 'clsx'
import { useCreatePoll } from '../hooks/useCreatePoll'
import { toDuration } from '../core/utils'

export interface CreatePollFormProps {
  onSuccess?: (pollId: bigint) => void
  onError?: (error: Error) => void
  className?: string
  minOptions?: number
  maxOptions?: number
}

/**
 * CreatePollForm component provides a form to create new polls
 *
 * @example
 * ```tsx
 * <CreatePollForm
 *   onSuccess={(pollId) => navigate(`/poll/${pollId}`)}
 *   minOptions={2}
 *   maxOptions={10}
 * />
 * ```
 */
export function CreatePollForm({
  onSuccess,
  onError,
  className,
  minOptions = 2,
  maxOptions = 10,
}: CreatePollFormProps) {
  const { createPoll, isPending, isSuccess, isError, error, pollId } = useCreatePoll()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  const [duration, setDuration] = useState<{ value: number; unit: 'minutes' | 'hours' | 'days' }>({
    value: 7,
    unit: 'days',
  })

  React.useEffect(() => {
    if (isSuccess && pollId && onSuccess) {
      onSuccess(pollId)
    }
  }, [isSuccess, pollId, onSuccess])

  React.useEffect(() => {
    if (isError && error && onError) {
      onError(error)
    }
  }, [isError, error, onError])

  const handleAddOption = () => {
    if (options.length < maxOptions) {
      setOptions([...options, ''])
    }
  }

  const handleRemoveOption = (index: number) => {
    if (options.length > minOptions) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validOptions = options.filter((opt) => opt.trim() !== '')
    if (validOptions.length < minOptions) {
      alert(`Please provide at least ${minOptions} options`)
      return
    }

    const durationInSeconds = toDuration(duration.value, duration.unit)

    createPoll({
      title,
      description,
      options: validOptions,
      duration: durationInSeconds,
    })
  }

  const isFormValid =
    title.trim() !== '' &&
    description.trim() !== '' &&
    options.filter((opt) => opt.trim() !== '').length >= minOptions

  return (
    <form onSubmit={handleSubmit} className={clsx('pp-space-y-6', className)}>
      <div className="pp-space-y-2">
        <label htmlFor="poll-title" className="polypuls3-label">
          Poll Title *
        </label>
        <input
          id="poll-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your poll about?"
          className="polypuls3-input"
          disabled={isPending}
          required
        />
      </div>

      <div className="pp-space-y-2">
        <label htmlFor="poll-description" className="polypuls3-label">
          Description *
        </label>
        <textarea
          id="poll-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide more details about your poll..."
          className="polypuls3-input pp-min-h-[100px] pp-resize-y"
          disabled={isPending}
          required
        />
      </div>

      <div className="pp-space-y-3">
        <label className="polypuls3-label">Options *</label>
        {options.map((option, index) => (
          <div key={index} className="pp-flex pp-gap-2">
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="polypuls3-input pp-flex-1"
              disabled={isPending}
            />
            {options.length > minOptions && (
              <button
                type="button"
                onClick={() => handleRemoveOption(index)}
                className="polypuls3-button polypuls3-button-secondary pp-px-3"
                disabled={isPending}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {options.length < maxOptions && (
          <button
            type="button"
            onClick={handleAddOption}
            className="polypuls3-button polypuls3-button-secondary pp-w-full"
            disabled={isPending}
          >
            Add Option
          </button>
        )}
      </div>

      <div className="pp-space-y-2">
        <label className="polypuls3-label">Duration *</label>
        <div className="pp-flex pp-gap-2">
          <input
            type="number"
            min="1"
            value={duration.value}
            onChange={(e) =>
              setDuration({ ...duration, value: parseInt(e.target.value) || 1 })
            }
            className="polypuls3-input pp-w-24"
            disabled={isPending}
          />
          <select
            value={duration.unit}
            onChange={(e) =>
              setDuration({ ...duration, unit: e.target.value as 'minutes' | 'hours' | 'days' })
            }
            className="polypuls3-input pp-flex-1"
            disabled={isPending}
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>
      </div>

      {isError && error && (
        <div className="pp-text-error pp-text-sm pp-p-3 pp-bg-error/10 pp-rounded-polypuls3">
          Error: {error.message}
        </div>
      )}

      <button
        type="submit"
        disabled={!isFormValid || isPending}
        className="polypuls3-button polypuls3-button-primary pp-w-full pp-py-3"
      >
        {isPending ? 'Creating Poll...' : 'Create Poll'}
      </button>
    </form>
  )
}
