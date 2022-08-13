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
  description: string;
  logoUrl: string;
  websiteUrl: string;
}

export interface Event {
  _id: string;
  chainId: string;
  address: string;
  contract: string;
  name: string;
  blockTimestamp: number;
  transactionHash: string;
}