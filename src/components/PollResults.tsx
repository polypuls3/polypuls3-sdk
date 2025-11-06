import clsx from 'clsx'
import { usePollResults } from '../hooks/usePollResults'
import { useTheme } from '../hooks/useTheme'
import { usePolyPulseConfig } from '../providers'
import { PollResultsBar } from './PollResultsBar'
import { PollResultsPie } from './PollResultsPie'
import { PollResultsInfographic } from './PollResultsInfographic'
import type { PollOption, ChartType, InfographicStyle, BarOrientation } from '../core/types'

export interface PollResultsProps {
  pollId: bigint | string
  options: readonly string[] | PollOption[] // Array of option texts or PollOption objects
  chainId?: number
  className?: string
  showVoteCount?: boolean
  showPercentage?: boolean
  chartType?: ChartType
  barOrientation?: BarOrientation
  infographicStyle?: InfographicStyle
  chartColors?: string[]
}

/**
 * PollResults component displays poll voting results with customizable visualizations
 *
 * @example
 * ```tsx
 * // Bar chart (default)
 * <PollResults
 *   pollId={1n}
 *   options={['Option A', 'Option B', 'Option C']}
 *   showVoteCount
 *   showPercentage
 * />
 *
 * // Pie chart
 * <PollResults
 *   pollId={1n}
 *   options={['Option A', 'Option B']}
 *   chartType="pie"
 * />
 *
 * // Infographic leaderboard
 * <PollResults
 *   pollId={1n}
 *   options={['Option A', 'Option B']}
 *   chartType="infographic"
 *   infographicStyle="leaderboard"
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
  chartType,
  barOrientation,
  infographicStyle,
  chartColors,
}: PollResultsProps) {
  const { isPremium } = useTheme()
  const { themeConfig } = usePolyPulseConfig()

  // Determine effective chart type and options from theme or props
  const effectiveChartType = chartType ?? themeConfig.chartConfig?.defaultType ?? 'bar'
  const effectiveBarOrientation = barOrientation ?? themeConfig.chartConfig?.barOrientation ?? 'horizontal'
  const effectiveInfographicStyle = infographicStyle ?? themeConfig.chartConfig?.infographicStyle ?? 'leaderboard'
  const effectiveColors = chartColors ?? themeConfig.chartConfig?.colors

  // Convert options to string array if needed
  const optionStrings: readonly string[] = Array.isArray(options)
    ? options.map((opt) => (typeof opt === 'string' ? opt : opt.text))
    : []

  const { results, totalVotes, isLoading, isError } = usePollResults({
    pollId,
    options: optionStrings,
    chainId,
  })

  // Find the leading option (highest percentage)
  const leadingOptionId = results.length > 0
    ? results.reduce((prev, current) =>
        (current.percentage || 0) > (prev.percentage || 0) ? current : prev
      ).id
    : null

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

  // Render appropriate chart type
  if (effectiveChartType === 'pie') {
    return (
      <PollResultsPie
        results={results}
        totalVotes={totalVotes}
        leadingOptionId={leadingOptionId}
        showVoteCount={showVoteCount}
        showPercentage={showPercentage}
        colors={effectiveColors}
        className={className}
        isPremium={isPremium}
      />
    )
  }

  if (effectiveChartType === 'infographic') {
    return (
      <PollResultsInfographic
        results={results}
        totalVotes={totalVotes}
        leadingOptionId={leadingOptionId}
        style={effectiveInfographicStyle}
        showVoteCount={showVoteCount}
        showPercentage={showPercentage}
        className={className}
        isPremium={isPremium}
      />
    )
  }

  // Default: bar chart
  return (
    <PollResultsBar
      results={results}
      totalVotes={totalVotes}
      leadingOptionId={leadingOptionId}
      showVoteCount={showVoteCount}
      showPercentage={showPercentage}
      orientation={effectiveBarOrientation}
      className={className}
      isPremium={isPremium}
    />
  )
}
