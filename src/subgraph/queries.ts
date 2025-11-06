import { gql } from 'graphql-request'

/**
 * Fragment for poll fields
 */
export const POLL_FIELDS = gql`
  fragment PollFields on Poll {
    id
    creator
    title
    description
    startTime
    endTime
    isActive
    createdAt
    totalVotes
    options {
      id
      text
      voteCount
    }
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
 * Query to fetch user votes
 */
export const GET_USER_VOTES = gql`
  query GetUserVotes($voter: Bytes!, $first: Int = 10, $skip: Int = 0) {
    votes(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
      where: { voter: $voter }
    ) {
      id
      voter
      poll {
        id
        title
      }
      option {
        id
        text
      }
      timestamp
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
