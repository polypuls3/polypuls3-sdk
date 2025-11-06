import { polygon, polygonAmoy } from 'wagmi/chains'

export const supportedChains = [polygon, polygonAmoy] as const

export type SupportedChainId = (typeof supportedChains)[number]['id']

/**
 * Contract addresses for each supported chain
 * PolyPuls3Poll contract addresses (UUPS Proxy)
 */
export const POLYPULS3_ADDRESSES: Record<SupportedChainId, `0x${string}`> = {
  [polygon.id]: '0x0000000000000000000000000000000000000000', // TODO: Deploy to Polygon Mainnet
  [polygonAmoy.id]: '0x23044915b2922847950737c8dF5fCCaebCFe6ECe', // Polygon Amoy Testnet
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
