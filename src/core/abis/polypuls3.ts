/**
 * Polypuls3 Contract ABI
 *
 * TODO: Replace this placeholder ABI with your actual contract ABI
 * You can copy the ABI from your smart contract project's artifacts
 * or use wagmi CLI to generate it automatically
 *
 * Example wagmi CLI command:
 * npx wagmi generate
 */

export const polypuls3Abi = [
  // View functions
  {
    inputs: [{ name: 'pollId', type: 'uint256' }],
    name: 'getPoll',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'creator', type: 'address' },
          { name: 'title', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'isActive', type: 'bool' },
        ],
        name: 'poll',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pollCount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'pollId', type: 'uint256' },
      { name: 'optionId', type: 'uint256' },
    ],
    name: 'getVoteCount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'pollId', type: 'uint256' },
      { name: 'voter', type: 'address' },
    ],
    name: 'hasVoted',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'pollId', type: 'uint256' },
      { name: 'voter', type: 'address' },
    ],
    name: 'getUserVote',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },

  // Write functions
  {
    inputs: [
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'options', type: 'string[]' },
      { name: 'duration', type: 'uint256' },
    ],
    name: 'createPoll',
    outputs: [{ name: 'pollId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'pollId', type: 'uint256' },
      { name: 'optionId', type: 'uint256' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'pollId', type: 'uint256' },
      { indexed: true, name: 'creator', type: 'address' },
      { indexed: false, name: 'title', type: 'string' },
    ],
    name: 'PollCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'pollId', type: 'uint256' },
      { indexed: true, name: 'voter', type: 'address' },
      { indexed: false, name: 'optionId', type: 'uint256' },
    ],
    name: 'VoteCast',
    type: 'event',
  },
] as const
