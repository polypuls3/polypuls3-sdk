/**
 * Basic Usage Example
 *
 * This example demonstrates how to use the Polypuls3 SDK in a Next.js application
 */

import { WagmiProvider, createConfig, http } from 'wagmi'
import { polygon, polygonAmoy } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'

// Import SDK components and hooks
import { PollWidget, CreatePollForm, PollCard } from '@polypuls3/sdk/components'
import { usePoll, useSubgraphPolls } from '@polypuls3/sdk'

// Import SDK styles
import '@polypuls3/sdk/styles'

// Configure wagmi
const config = createConfig(
  getDefaultConfig({
    chains: [polygon, polygonAmoy],
    transports: {
      [polygon.id]: http(),
      [polygonAmoy.id]: http(),
    },
    walletConnectProjectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
    appName: 'Polypuls3 Example',
  })
)

const queryClient = new QueryClient()

// Example 1: Display a single poll with voting
function PollExample() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Poll Example</h1>
      <PollWidget
        pollId={1n}
        onVoteSuccess={() => alert('Vote successful!')}
        onVoteError={(error) => alert(`Error: ${error.message}`)}
      />
    </div>
  )
}

// Example 2: Create a new poll
function CreatePollExample() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Poll</h1>
      <CreatePollForm
        onSuccess={(pollId) => {
          alert(`Poll created with ID: ${pollId}`)
        }}
        onError={(error) => {
          alert(`Error creating poll: ${error.message}`)
        }}
      />
    </div>
  )
}

// Example 3: List polls from subgraph
function PollListExample() {
  const { polls, isLoading, error } = useSubgraphPolls({
    status: 'active',
    limit: 10,
  })

  if (isLoading) return <div>Loading polls...</div>
  if (error) return <div>Error loading polls: {error.message}</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Active Polls</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {polls.map((poll) => (
          <PollCard
            key={poll.id.toString()}
            poll={poll}
            onClick={() => window.location.href = `/poll/${poll.id}`}
          />
        ))}
      </div>
    </div>
  )
}

// Example 4: Headless usage with custom UI
function CustomPollUI() {
  const { poll, isLoading } = usePoll({ pollId: 1n })

  if (isLoading) return <div>Loading...</div>
  if (!poll) return <div>Poll not found</div>

  return (
    <div className="custom-poll">
      <h2>{poll.title}</h2>
      <p>{poll.description}</p>
      {/* Build your own custom UI using the poll data */}
    </div>
  )
}

// Main App with providers
export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          {/* Your app content */}
          <PollExample />
          {/* <CreatePollExample /> */}
          {/* <PollListExample /> */}
          {/* <CustomPollUI /> */}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
