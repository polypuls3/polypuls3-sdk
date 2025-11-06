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
