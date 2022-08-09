export interface VeNFT {
  id: string;
  name: string;
  description: string;
  image: string;
  votingPower: string;
  amount: string;
  rewardAmount: string;
  balance: string;
  endTime: number;
  token: string;
  tokenSymbol: string;
  tokenRatio: number | string;
  claimable: string;
  unclaimable: string;
  reward: string;
}

interface VotingLogs {
  categories: number[];
  votingPower: number[];
  percentage: number[];
}
