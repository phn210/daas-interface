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
  startBlock: string;
  quorum: string;
  title: string;
  createdAt: number | string;
  stateTimestamp: number | string;
  stateText: string;
}
