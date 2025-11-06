/**
 * Subgraph endpoints for different networks
 */
export const SUBGRAPH_URLS = {
  137: 'https://api.studio.thegraph.com/query/122132/polypuls3-polygon/version/latest', // Polygon Mainnet (TODO: Deploy)
  80002: 'https://api.studio.thegraph.com/query/122132/polypuls-3-subgraph/version/latest', // Amoy Testnet
} as const

export type SupportedSubgraphChainId = keyof typeof SUBGRAPH_URLS

/**
 * Get the subgraph URL for a given chain ID
 */
export function getSubgraphUrl(chainId: number): string | undefined {
  return SUBGRAPH_URLS[chainId as SupportedSubgraphChainId]
}
