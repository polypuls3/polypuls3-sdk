# Polypuls3 SDK

React SDK for embedding Polypuls3 polls in decentralized applications on Polygon.

## Features

- 🎨 **Pre-built UI Components** - Ready-to-use React components with customizable theming
- 🎣 **Headless Hooks** - Build custom UIs with powerful React hooks
- ⚡ **Wagmi Integration** - Built on wagmi v2 for seamless Web3 interactions
- 🔗 **Subgraph Support** - Efficient data fetching via The Graph
- 🎯 **TypeScript First** - Fully typed for the best developer experience
- 🌈 **Themeable** - Customize colors and styles with CSS variables
- 📦 **Tree-shakeable** - Import only what you need

## Installation

```bash
npm install @polypuls3/sdk wagmi viem @tanstack/react-query
```

## Quick Start

### 1. Setup Wagmi Provider

```tsx
import { WagmiProvider, createConfig, http } from 'wagmi'
import { polygon, polygonAmoy } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const config = createConfig({
  chains: [polygon, polygonAmoy],
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
})

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* Your app */}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### 2. Import Styles

```tsx
import '@polypuls3/sdk/styles'
```

### 3. Use Components

```tsx
import { PollWidget } from '@polypuls3/sdk/components'

function MyPoll() {
  return <PollWidget pollId={1n} />
}
```

## Components

### PollWidget

Complete poll display with voting functionality.

```tsx
import { PollWidget } from '@polypuls3/sdk/components'

<PollWidget
  pollId={1n}
  onVoteSuccess={() => console.log('Vote successful!')}
  onVoteError={(error) => console.error(error)}
/>
```

### CreatePollForm

Form component for creating new polls.

```tsx
import { CreatePollForm } from '@polypuls3/sdk/components'

<CreatePollForm
  onSuccess={(pollId) => navigate(`/poll/${pollId}`)}
  minOptions={2}
  maxOptions={10}
/>
```

### PollCard

Poll preview card component.

```tsx
import { PollCard } from '@polypuls3/sdk/components'

<PollCard
  poll={poll}
  onClick={() => navigate(`/poll/${poll.id}`)}
/>
```

### PollResults

Display poll results with visual bars.

```tsx
import { PollResults } from '@polypuls3/sdk/components'

<PollResults
  pollId={1n}
  optionCount={3}
  showVoteCount
  showPercentage
/>
```

### VoteButton

Button component for voting on a specific option.

```tsx
import { VoteButton } from '@polypuls3/sdk/components'

<VoteButton
  pollId={1n}
  optionId={0n}
  onSuccess={() => alert('Voted!')}
>
  Vote for this option
</VoteButton>
```

## Hooks

### usePoll

Fetch a single poll by ID.

```tsx
import { usePoll } from '@polypuls3/sdk/hooks'

const { poll, isLoading, isError } = usePoll({ pollId: 1n })
```

### useVote

Vote on a poll.

```tsx
import { useVote } from '@polypuls3/sdk/hooks'

const { vote, isPending, isSuccess } = useVote()

vote({ pollId: 1n, optionId: 0n })
```

### useCreatePoll

Create a new poll.

```tsx
import { useCreatePoll } from '@polypuls3/sdk/hooks'

const { createPoll, isPending, pollId } = useCreatePoll()

createPoll({
  title: 'My Poll',
  description: 'What do you think?',
  options: ['Option 1', 'Option 2'],
  duration: 86400n, // 1 day in seconds
})
```

### usePollResults

Fetch poll results with vote counts and percentages.

```tsx
import { usePollResults } from '@polypuls3/sdk/hooks'

const { results, totalVotes, isLoading } = usePollResults({
  pollId: 1n,
  optionCount: 3,
})
```

### useHasVoted

Check if a user has voted on a poll.

```tsx
import { useHasVoted } from '@polypuls3/sdk/hooks'

const { hasVoted, userVote } = useHasVoted({ pollId: 1n })
```

## Subgraph Integration

The SDK includes hooks for fetching data from The Graph subgraph.

```tsx
import { useSubgraphPolls } from '@polypuls3/sdk'

const { polls, isLoading } = useSubgraphPolls({
  status: 'active',
  limit: 10,
})
```

### Subgraph Hooks

- `useSubgraphPoll(pollId)` - Fetch a poll from subgraph
- `useSubgraphPolls(filters)` - Fetch multiple polls
- `useSubgraphUserVotes(voter)` - Fetch user's vote history

## Theming

Customize the SDK's appearance using CSS variables:

```css
:root {
  --polypuls3-primary: #8247e5;
  --polypuls3-primary-foreground: #ffffff;
  --polypuls3-background: #ffffff;
  --polypuls3-foreground: #0f172a;
  --polypuls3-border: #e2e8f0;
  --polypuls3-radius: 0.5rem;
}

/* Dark mode */
.dark {
  --polypuls3-primary: #a78bfa;
  --polypuls3-background: #0f172a;
  --polypuls3-foreground: #f1f5f9;
}
```

## Configuration

Before using the SDK, update the following configuration files in your installation:

### 1. Contract Addresses

Update `src/core/config/chains.ts` with your deployed contract addresses:

```typescript
export const POLYPULS3_ADDRESSES = {
  [polygon.id]: '0xYourMainnetAddress',
  [polygonAmoy.id]: '0xYourAmoyAddress',
}
```

### 2. Contract ABIs

Replace the placeholder ABI in `src/core/abis/polypuls3.ts` with your actual contract ABI from your smart contract project.

### 3. Subgraph URLs

Update `src/subgraph/config.ts` with your subgraph endpoints:

```typescript
export const SUBGRAPH_URLS = {
  137: 'https://api.studio.thegraph.com/query/your-id/polypuls3-polygon/version/latest',
  80002: 'https://api.studio.thegraph.com/query/your-id/polypuls3-amoy/version/latest',
}
```

## Core Utilities

The SDK includes helpful utility functions:

```tsx
import {
  getPollStatus,
  isPollActive,
  calculateVotePercentages,
  formatDuration,
  formatTimestamp,
  getTimeRemaining,
  truncateAddress,
  toDuration,
} from '@polypuls3/sdk/core'
```

## Package Exports

The SDK provides multiple entry points for tree-shaking:

```tsx
// Main entry - everything
import { PollWidget } from '@polypuls3/sdk'

// Hooks only
import { usePoll } from '@polypuls3/sdk/hooks'

// Components only
import { PollWidget } from '@polypuls3/sdk/components'

// Core utilities and types
import { Poll, getPollStatus } from '@polypuls3/sdk/core'
```

## TypeScript Support

The SDK is written in TypeScript and includes comprehensive type definitions.

```tsx
import type { Poll, PollOption, CreatePollParams } from '@polypuls3/sdk'
```

## Development

### Build the SDK

```bash
npm install
npm run build
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-org/polypuls3-sdk/issues)
- Documentation: See `/examples` directory for more examples

## Links

- [Polypuls3 Website](https://polypuls3.com)
- [Documentation](https://docs.polypuls3.com)
- [GitHub](https://github.com/your-org/polypuls3-sdk)
