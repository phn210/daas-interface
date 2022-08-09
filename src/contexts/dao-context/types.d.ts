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