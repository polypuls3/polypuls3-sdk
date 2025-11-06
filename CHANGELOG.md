# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-XX-XX

### Added

#### Core
- Contract ABIs and type definitions
- Network configuration for Polygon PoS and Amoy testnet
- TypeScript types for polls, votes, and filters
- Utility functions for poll status, formatting, and calculations

#### Hooks
- `usePoll` - Fetch a single poll by ID
- `useVote` - Vote on a poll
- `useCreatePoll` - Create a new poll
- `usePollResults` - Fetch poll results with percentages
- `useHasVoted` - Check if user has voted

#### Components
- `PollWidget` - Complete poll display with voting
- `PollCard` - Poll preview card
- `PollResults` - Results visualization with bars
- `VoteButton` - Voting action button
- `CreatePollForm` - Poll creation form

#### Subgraph
- GraphQL queries for polls and votes
- Subgraph client functions
- React hooks for subgraph data (`useSubgraphPoll`, `useSubgraphPolls`, `useSubgraphUserVotes`)

#### Styling
- Tailwind CSS integration with `pp-` prefix
- CSS variables for theming
- Dark mode support
- Pre-built component styles

#### Documentation
- Comprehensive README with API documentation
- Setup guide (SETUP.md)
- Contributing guidelines (CONTRIBUTING.md)
- Usage examples

### Configuration
- TypeScript configuration with strict mode
- tsup build configuration for dual ESM/CJS output
- ESLint configuration
- Package.json with proper exports

## [0.5.1] - 2025-01-06

### Fixed
- Confetti celebration not working in demo/MockPollWidget components
- celebrateVote function now properly imported and called

### Added
- Constrained confetti mode that limits confetti particles to widget boundaries
- `constrained` option in ConfettiConfig to enable boundary-constrained confetti (default: false)
- `origin` configuration option for customizing confetti spawn point with x and y coordinates (0-1 range)
- `createConfettiInstance()` function for creating canvas-specific confetti instances
- Canvas element overlay in PollWidget and MockPollWidget for constrained rendering
- CSS classes `.pp-confetti-container` and `.pp-confetti-canvas` for proper positioning

### Enhanced
- ConfettiConfig interface now includes `constrained` and `origin` properties
- `celebrateVote()` function updated to accept optional canvas element for constrained rendering
- PollWidget component supports both global (viewport-wide) and constrained (widget-bounded) confetti modes
- Improved confetti animation with better control over spawn location and boundaries

### Documentation
- Added TypeScript documentation for new confetti configuration options
- Improved JSDoc comments for celebrateVote and createConfettiInstance functions

## [0.5.0] - 2025-01-05

### Added
- Customizable chart types for poll results visualization
- Three chart type options: `bar` (default), `pie`, and `infographic`
- PollResultsBar component with horizontal and vertical orientations
- PollResultsPie component using Recharts library
- PollResultsInfographic component with three styles: icons, leaderboard, and cards
- ChartConfig interface in theme configuration for global chart settings
- New props on PollWidget: `chartType`, `barOrientation`, `infographicStyle`, `chartColors`

### Enhanced
- Refactored PollResults component to route to specialized chart components
- Added peer dependency on recharts (^2.0.0) for pie chart support
- Theme system now supports chart configuration at global level

## [0.4.9] - 2025-01-04

### Added
- MockPollWidget component for demo purposes without blockchain dependency
- MockPollResults component matching real PollResults styling
- Mock data support in features demo page for reliable demonstrations

### Fixed
- Features demo now works regardless of poll status or blockchain availability

## [0.4.8] - 2025-01-03

### Added
- Display mode control: `vote`, `result`, and `mixed` modes for PollWidget
- Results visibility toggle with `showResults` prop
- Success banner with customizable message and duration
- Confetti celebration effect on successful vote
- Widget size variants: `small`, `medium`, `large`
- Custom success messages and durations
- Interactive Playground component in demo for testing all widget settings

### Enhanced
- PollWidget component with flexible display modes
- Success feedback with banner and confetti options
- Responsive sizing system for widgets

## [Unreleased]

### To Do
- Add unit tests with Vitest
- Add component tests with React Testing Library
- Add Storybook for component documentation
- Implement wagmi CLI integration for ABI generation
- Add more utility hooks (e.g., `usePollStatistics`)
- Implement pagination for poll lists
- Add WebSocket support for real-time updates
- Create CodeSandbox examples
- Add GitHub Actions for CI/CD
- Publish to npm registry

---

[0.1.0]: https://github.com/your-org/polypuls3-sdk/releases/tag/v0.1.0
