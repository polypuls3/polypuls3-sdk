import { polygon, polygonAmoy } from 'wagmi/chains'

export const supportedChains = [polygon, polygonAmoy] as const

export type SupportedChainId = (typeof supportedChains)[number]['id']

/**
 * Contract addresses for each supported chain
 * TODO: Update these addresses with your deployed contract addresses
 */
export const POLYPULS3_ADDRESSES: Record<SupportedChainId, `0x${string}`> = {
  [polygon.id]: '0x0000000000000000000000000000000000000000', // TODO: Add Polygon Mainnet address
  [polygonAmoy.id]: '0x0000000000000000000000000000000000000000', // TODO: Add Amoy Testnet address
}

/**
 * Get the Polypuls3 contract address for a given chain ID
 */
export function getPolypuls3Address(chainId: number): `0x${string}` | undefined {
  return POLYPULS3_ADDRESSES[chainId as SupportedChainId]
}

/**
 * Check if a chain is supported by the SDK
 */
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return chainId in POLYPULS3_ADDRESSES
}
