/**
 * Subgraph endpoints for different networks
 * TODO: Replace with your actual subgraph URLs
 */
export const SUBGRAPH_URLS = {
  137: 'https://api.studio.thegraph.com/query/<your-subgraph-id>/polypuls3-polygon/version/latest', // Polygon Mainnet
  80002: 'https://api.studio.thegraph.com/query/<your-subgraph-id>/polypuls3-amoy/version/latest', // Amoy Testnet
} as const

export type SupportedSubgraphChainId = keyof typeof SUBGRAPH_URLS

/**
 * Get the subgraph URL for a given chain ID
 */
export function getSubgraphUrl(chainId: number): string | undefined {
  return SUBGRAPH_URLS[chainId as SupportedSubgraphChainId]
}
