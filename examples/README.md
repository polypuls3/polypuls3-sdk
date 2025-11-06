# Polypuls3 SDK Examples

This directory contains example code demonstrating how to use the Polypuls3 SDK.

## Examples

### basic-usage.tsx
Demonstrates the core functionality of the SDK:
- Displaying a poll with voting functionality
- Creating new polls
- Listing polls from the subgraph
- Using headless hooks for custom UI

## Running the Examples

To use these examples in your Next.js application:

1. Install the SDK and required dependencies:
```bash
npm install @polypuls3/sdk wagmi viem @tanstack/react-query connectkit
```

2. Configure your wagmi provider with Polygon networks

3. Import the SDK styles in your `_app.tsx` or layout:
```tsx
import '@polypuls3/sdk/styles'
```

4. Copy the example code into your components

## Configuration

Before using the examples, make sure to:

1. Update contract addresses in the SDK's chain config
2. Configure your WalletConnect project ID
3. Update subgraph URLs if using subgraph features
4. Replace ABIs with your actual contract ABIs

## Learn More

See the main README.md for detailed documentation on all available components and hooks.
