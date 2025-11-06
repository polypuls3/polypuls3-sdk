// ABIs
export { polypuls3PollAbi } from './abis/polypuls3'
// Re-export with legacy name for backwards compatibility
export { polypuls3PollAbi as polypuls3Abi } from './abis/polypuls3'

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
