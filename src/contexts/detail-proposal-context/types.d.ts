export interface ProposalContent {
  title: string;
  authors: string[];
  organizations: string[];
  description: string;
  discussions: string;
  shortDescription: string;
  preview: string;
  salt: string;
  created: string;
  ipfsCid: string;
}

export interface StatusProposal {
  status: number | string;
  tx: string;
  timestamp: string | number;
}

export interface UserVoteInfor {
  votingPower: number | string;
  weight: number | string;
  isVoted: boolean;
  votedPower: number | string;
  votedChoice: 'For' | 'Against';
  votedTimestamp: number | string;
}

export interface VotingResultDetail {
  forVotes: number | string;
  startBlock: string;
  forVotesPercentage: number | string;
  againstVotes: number | string;
  againstVotesPercentage: number | string;
  status: number | string;
  quorum: string;
  currentVotes: string;
  totalVotingPower: string;
  totalVote: string;
}
