import { gql } from 'graphql-request'

/**
 * Fragment for poll fields
 * Matches the actual subgraph schema
 */
export const POLL_FIELDS = gql`
  fragment PollFields on Poll {
    id
    pollId
    creator
    question
    options
    createdAt
    expiresAt
    rewardPool
    isActive
    totalResponses
    category
    projectId
    votingType
    visibility
    status
    platformFeeAmount
    claimedRewards
  }
`

/**
 * Query to fetch a single poll by ID
 */
export const GET_POLL = gql`
  ${POLL_FIELDS}
  query GetPoll($id: ID!) {
    poll(id: $id) {
      ...PollFields
    }
  }
`

/**
 * Query to fetch multiple polls with filters
 */
export const GET_POLLS = gql`
  ${POLL_FIELDS}
  query GetPolls(
    $first: Int = 10
    $skip: Int = 0
    $orderBy: Poll_orderBy = createdAt
    $orderDirection: OrderDirection = desc
    $where: Poll_filter
  ) {
    polls(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...PollFields
    }
  }
`

/**
 * Query to fetch active polls
 */
export const GET_ACTIVE_POLLS = gql`
  ${POLL_FIELDS}
  query GetActivePolls($first: Int = 10, $skip: Int = 0) {
    polls(
      first: $first
      skip: $skip
      orderBy: createdAt
      orderDirection: desc
      where: { isActive: true }
    ) {
      ...PollFields
    }
  }
`

/**
 * Query to fetch polls by creator
 */
export const GET_POLLS_BY_CREATOR = gql`
  ${POLL_FIELDS}
  query GetPollsByCreator($creator: Bytes!, $first: Int = 10, $skip: Int = 0) {
    polls(
      first: $first
      skip: $skip
      orderBy: createdAt
      orderDirection: desc
      where: { creator: $creator }
    ) {
      ...PollFields
    }
  }
`

/**
 * Query to fetch user votes (poll responses)
 * Uses PollResponse entity from the actual schema
 */
export const GET_USER_VOTES = gql`
  query GetUserVotes($voter: Bytes!, $first: Int = 10, $skip: Int = 0) {
    pollResponses(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
      where: { respondent: $voter }
    ) {
      id
      pollId
      respondent
      optionIndex
      timestamp
      rewardClaimed
      poll {
        id
        pollId
        question
        options
      }
    }
  }
`

/**
 * Query to get poll statistics
 */
export const GET_POLL_STATS = gql`
  query GetPollStats {
    pollStats: polls(first: 1) {
      id
    }
    totalPolls: polls {
      id
    }
  }
`
