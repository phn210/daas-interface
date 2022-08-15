export interface Proposal {
  _id: string;
  id: string;
  status: number;
  abstainVotes?: string;
  abstainVotesPercentage?: string;
  againstVotes?: string;
  againstVotesPercentage?: string;
  forVotes?: string;
  forVotesPercentage?: string;
  cancelled?: boolean;
  duration?: number;
  executed?: boolean;
  eta?: number;
  proposer: string;
  startBlock?: string;
  quorumAttendance?: string;
  quorumApproval?: string;
  title: string;
  createdAt?: number | string;
  stateTimestamp?: number | string;
  stateText?: string;
}

export interface Action {
  target: string;
  value: number;
  signature: string;
  data: string;
}

export interface Author {
  name: string;
  handle?: string;
}

export interface IPFS {
  title: string;
  authors: Author[];
  organization?: string;
  discussions: string;
  shortDescription: string;
  description: string;
}
