export interface DAO {
  _id: string;
  chainId: string;
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

type GTokenConfig = {
  deployedAddress: string;
  standard: number;
  name: string;
  symbol: string;
  owner: string;
  decimals: number;
  initialSupply: number;
}

type BaseConfig = {
  minVotingDelay: number;
  maxVotingDelay: number;
  minVotingPeriod: number;
  maxVotingPeriod: number;
  isWhiteListRequired: boolean;
  defaultExpiration?: number;
}

type GovernorConfig = {
  votingDelay: number;
  votingPeriod: number;
  quorumAttendance: number;
  quorumApproval: number;
}

type TimelockConfig = {
  minTimelockDelay: number;
  maxTimelockDelay: number;
  delay: number;
  gracePeriod: number;
}

type IPFS = {
  name: string;
  logoUrl: string;
  websiteUrl: string;
  shortDescription: string;
  description: string;
}

type Initialization = {
  name: string;
  symbol: string;
  owner: string;
  decimals: number;
  initialSupply: number;
}