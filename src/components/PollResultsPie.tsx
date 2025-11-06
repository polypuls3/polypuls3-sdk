import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import clsx from 'clsx'
import type { PollOption } from '../core/types'

export interface PollResultsPieProps {
  results: PollOption[]
  totalVotes: bigint
  leadingOptionId: string | bigint | null
  showVoteCount?: boolean
  showPercentage?: boolean
  colors?: string[]
  className?: string
  isPremium?: boolean
}

// Default color palette using Polypuls3 theme colors
const DEFAULT_COLORS = [
  '#8247e5', // primary
  '#a78bfa', // primary-light
  '#22c55e', // success
  '#64748b', // secondary
  '#6d28d9', // primary-dark
  '#4ade80', // success-light
]

/**
 * PollResultsPie component displays poll results as a pie chart
 * Uses Recharts library for visualization
 *
 * @example
 * ```tsx
 * <PollResultsPie
 *   results={results}
 *   totalVotes={100n}
 *   leadingOptionId={0}
 * />
 * ```
 */
export function PollResultsPie({
  results,
  totalVotes,
  leadingOptionId,
  showVoteCount = true,
  showPercentage = true,
  colors = DEFAULT_COLORS,
  className,
  isPremium = false,
}: PollResultsPieProps) {
  // Transform results for Recharts
  const chartData = results.map((option) => ({
    name: option.text,
    value: Number(option.voteCount),
    percentage: option.percentage || 0,
    id: option.id,
  }))

  // Custom label renderer
  const renderLabel = (entry: any) => {
    if (!showPercentage) return ''
    return `${entry.percentage.toFixed(1)}%`
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const isLeading = data.payload.id === leadingOptionId

      return (
        <div className="pp-bg-background pp-border pp-border-border pp-rounded-polypuls3 pp-p-3 pp-shadow-md">
          <div className="pp-flex pp-items-center pp-gap-2 pp-mb-1">
            <p className="pp-text-sm pp-font-semibold pp-text-foreground">
              {data.name}
            </p>
            {isLeading && isPremium && (
              <span className="pp-text-sm" title="Leading">
                👑
              </span>
            )}
          </div>
          {showVoteCount && (
            <p className="pp-text-xs pp-text-muted-foreground">
              {data.value} vote{data.value !== 1 ? 's' : ''}
            </p>
          )}
          {showPercentage && (
            <p className="pp-text-xs pp-font-medium pp-text-primary">
              {data.payload.percentage.toFixed(1)}%
            </p>
          )}
        </div>
      )
    }
    return null
  }

  // Custom legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="pp-flex pp-flex-wrap pp-justify-center pp-gap-3 pp-mt-4">
        {payload.map((entry: any, index: number) => {
          const isLeading = entry.payload.id === leadingOptionId

          return (
            <div
              key={`legend-${index}`}
              className="pp-flex pp-items-center pp-gap-2"
            >
              <div
                className="pp-w-3 pp-h-3 pp-rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className={clsx(
                'pp-text-sm',
                isLeading && isPremium ? 'pp-text-success pp-font-semibold' : 'pp-text-foreground'
              )}>
                {entry.value}
                {isLeading && isPremium && ' 👑'}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  if (totalVotes === 0n) {
    return (
      <div className={clsx('pp-flex pp-items-center pp-justify-center pp-h-64 pp-text-muted-foreground', className)}>
        <p className="pp-text-sm">No votes yet</p>
      </div>
    )
  }

  return (
    <div className={clsx('pp-pie-chart-container', className)}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationDuration={300}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke={entry.id === leadingOptionId && isPremium ? '#22c55e' : 'transparent'}
                strokeWidth={entry.id === leadingOptionId && isPremium ? 3 : 0}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Total votes */}
      <div className="pp-text-sm pp-text-muted-foreground pp-text-center pp-mt-4 pp-pt-3 pp-border-t pp-border-border">
        Total votes: {totalVotes.toString()}
      </div>
    </div>
  )
}
