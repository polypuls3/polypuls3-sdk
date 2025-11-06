# Polypuls3 SDK Setup Guide

This guide will help you complete the setup and start using your Polypuls3 SDK.

## Step 1: Install Dependencies

Run the following command to install all dependencies:

```bash
npm install
```

## Step 2: Configure Contract Addresses

Update the contract addresses in `src/core/config/chains.ts`:

1. Locate your deployed smart contract addresses from your sibling smart contract project
2. Update the `POLYPULS3_ADDRESSES` object:

```typescript
export const POLYPULS3_ADDRESSES: Record<SupportedChainId, `0x${string}`> = {
  [polygon.id]: '0xYOUR_POLYGON_MAINNET_ADDRESS',
  [polygonAmoy.id]: '0xYOUR_AMOY_TESTNET_ADDRESS',
}
```

## Step 3: Import Contract ABIs

Copy your actual contract ABIs from your smart contract project:

1. Locate the ABI JSON file in your smart contract project (usually in `artifacts/` or `out/` directory)
2. Replace the placeholder ABI in `src/core/abis/polypuls3.ts` with your actual ABI

### Option A: Manual Copy
Copy the ABI array from your contract's artifact file and paste it into `polypuls3.ts`.

### Option B: Use Wagmi CLI (Recommended)
1. Create a `wagmi.config.ts` file:

```typescript
import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import { Abi } from 'abitype'

export default defineConfig({
  out: 'src/core/abis/generated.ts',
  contracts: [
    {
      name: 'Polypuls3',
      abi: [...], // Your ABI here
    },
  ],
  plugins: [react()],
})
```

2. Run: `npx wagmi generate`

## Step 4: Configure Subgraph URLs

If you're using The Graph for data indexing:

1. Deploy your subgraph (from your sibling subgraph project)
2. Update `src/subgraph/config.ts` with your subgraph endpoints:

```typescript
export const SUBGRAPH_URLS = {
  137: 'https://api.studio.thegraph.com/query/<your-id>/polypuls3-polygon/version/latest',
  80002: 'https://api.studio.thegraph.com/query/<your-id>/polypuls3-amoy/version/latest',
}
```

## Step 5: Build the SDK

Build the SDK to ensure everything is configured correctly:

```bash
npm run build
```

This will create the `dist/` directory with compiled code.

## Step 6: Test the Build

Run type checking and linting:

```bash
npm run typecheck
npm run lint
```

## Step 7: Local Development

For local development and testing:

### Option A: Link Locally

1. In the SDK directory, create a link:
```bash
npm link
```

2. In your frontend project:
```bash
npm link @polypuls3/sdk
```

3. Run the SDK in watch mode:
```bash
npm run dev
```

### Option B: Use npm pack

1. Build and pack the SDK:
```bash
npm run build
npm pack
```

2. Install in your frontend project:
```bash
npm install /path/to/polypuls3-sdk/polypuls3-sdk-0.1.0.tgz
```

## Step 8: Publish to npm (Optional)

When ready to publish:

1. Update version in `package.json`
2. Login to npm: `npm login`
3. Publish: `npm publish --access public`

## Next Steps

### In Your Frontend Application

1. Install the SDK:
```bash
npm install @polypuls3/sdk wagmi viem @tanstack/react-query
```

2. Set up wagmi provider (see README.md)

3. Import and use components:
```tsx
import { PollWidget } from '@polypuls3/sdk/components'
import '@polypuls3/sdk/styles'

function MyApp() {
  return <PollWidget pollId={1n} />
}
```

## Verifying Your Setup

Create a simple test file to verify everything works:

```tsx
// test.tsx
import { usePoll } from './src/hooks/usePoll'
import { PollWidget } from './src/components/PollWidget'

// This should compile without errors if everything is set up correctly
```

Run: `npm run typecheck`

## Common Issues

### Issue: Type errors in hooks
**Solution**: Make sure you've updated the ABI with your actual contract ABI

### Issue: Contract not found errors
**Solution**: Verify contract addresses are correct in `chains.ts`

### Issue: Build fails
**Solution**: Run `npm install` again and check for missing dependencies

### Issue: Styles not working
**Solution**: Make sure to import `@polypuls3/sdk/styles` in your app

## Getting Help

- Check the examples in `/examples` directory
- Review the README.md for detailed API documentation
- Ensure your smart contract and subgraph projects are properly deployed

## Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Contract addresses updated in `src/core/config/chains.ts`
- [ ] Contract ABI replaced in `src/core/abis/polypuls3.ts`
- [ ] Subgraph URLs configured in `src/subgraph/config.ts` (if using subgraph)
- [ ] SDK builds successfully (`npm run build`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Ready to use in your frontend application!

---

You're all set! Your Polypuls3 SDK is ready to be integrated into your dapp. 🎉
