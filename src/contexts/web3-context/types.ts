export interface Web3ConnectState {
  chainId: number;
  accounts: string[];
  activating: boolean;
  error?: Error;
}
