import { BN } from 'src/utils';

export const isDev = process.env.NODE_ENV === 'development';

export const isEnableTestnet = process.env.REACT_APP_ENABLE_TESTNET === 'true';
export const isEnableDevTools = process.env.REACT_APP_ENABLE_DEV_TOOL === 'true';

export enum FetchingStatus {
  IDLE = 'idle',
  FETCHING = 'fetching',
  UPDATING = 'updating',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export const BASE18 = BN(10).pow(18);
export const BASE = {
  TRAVA: BASE18,
  RTRAVA: BASE18,
};

export const SYMBOLS: { [symbol: string]: string } = {
  'Cake-LP': 'BNB/TRAVA',
};

export const FACTORY_CONFIG = {
  MAX_GOVERNOR_CONFIG: 3,
  MAX_TIMELOCK_CONFIG: 3,
  MAX_PROPOSAL: 11
}
