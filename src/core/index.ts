// ABIs
export { polypuls3PollAbi } from './abis/polypuls3'
// Re-export with legacy name for backwards compatibility
export { polypuls3PollAbi as polypuls3Abi } from './abis/polypuls3'

// Contract helpers
export { fetchPollsFromContract } from './contracts/pollsList'

// Chain configuration
export {
  supportedChains,
  POLYPULS3_ADDRESSES,
  getPolypuls3Address,
  isSupportedChain,
  type SupportedChainId,
} from './config/chains'

// Data source configuration
export {
  DEFAULT_DATA_SOURCE_CONFIG,
  type DataSource,
  type DataSourceConfig,
} from './config/dataSource'

// Theme configuration
export {
  DEFAULT_THEME_CONFIG,
  MINIMAL_THEME,
  PREMIUM_THEME,
  BORDER_RADIUS_VALUES,
  SPACING_MULTIPLIERS,
  type ThemeConfig,
  type ThemePreset,
  type ThemeColors,
  type ThemeEffects,
  type ThemeSpacing,
  type ThemeBorderRadius,
  type WidgetSize,
} from './config/theme'

// Types
export type {
  Poll,
  PollOption,
  PollMetadata,
  CreatePollParams,
  VoteParams,
  UserVote,
  PollFilters,
  PollsQueryResult,
  TransactionStatus,
  Polypuls3Error,
} from './types'

export { PollStatus } from './types'

// Utilities
export {
  getPollStatus,
  isPollActive,
  calculateVotePercentages,
  formatDuration,
  formatTimestamp,
  getTimeRemaining,
  truncateAddress,
  toDuration,
} from './utils'
