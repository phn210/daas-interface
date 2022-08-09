export interface DAO {
  _id: string;
  chainId: string;
  governor: string;
  index: number;
  infoHash: string;
  isBlacklisted: boolean;
  isRetired: boolean;
  name: string;
  shortDescription: string;
  description?: string;
  logoUrl: string;
  websiteUrl: string;
}

export interface Proposal {
  id: string;
  status: number;
  againstVotes: string;
  againstVotesPercentage: string;
  forVotes: string;
  forVotesPercentage: string;
  cancelled: boolean;
  duration: number;
  executed: boolean;
  eta: number;
  proposer: string;
  startBlock: number | string;
  quorumAttendance: string;
  quorumApproval: string;
  title: string;
  stateTimestamp: number | string;
  stateText: string;
}

export interface GovernorBaseConfig {
  minVotingDelay: number;
  maxVotingDelay: number;
  minVotingPeriod: number;
  maxVotingPeriod: number;
  isWhitelistRequired: boolean;
}

export interface GovernorConfig {
  votingDelay: number;
  votingPeriod: number;
  quorumAttendance: number;
  quorumApproval: number;
}

export interface TimelockConfig {
  minTimelockDelay: number;
  maxTimelockDelay: number;
  delay: number;
  gracePeriod: number;
}