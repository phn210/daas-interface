import { AddEthereumChainParameter } from '@web3-react/types';

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18,
};

const BNB: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'BNB',
  symbol: 'BNB',
  decimals: 18,
};

const FTM: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Fantom',
  symbol: 'FTM',
  decimals: 18,
};

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
};

interface BasicChainInformation {
  urls: string[];
  name: string;
  isTestnet?: boolean;
}

export interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency'];
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls'];
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
}

function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    };
  } else {
    return chainId;
  }
}

const CHAIN_IDS = {
  ETH_MAINNET: 1,
  RINKEBY: 4,
  BSC_MAINNET: 56,
  BSC_TESTNET: 97,
  LOCALHOST: 31337
};

const CHAINS: { [chainId: number]: ExtendedChainInformation } = {
  [CHAIN_IDS.ETH_MAINNET]: {
    name: 'ETH Mainnet',
    blockExplorerUrls: ['https://etherscan.io'],
    nativeCurrency: ETH,
    urls: [
      process.env.INFURA_KEY ? `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}` : '',
      'https://cloudflare-eth.com',
    ].filter((url) => url !== ''),
  },
  [CHAIN_IDS.RINKEBY]: {
    name: 'Rinkeby Testnet',
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
    nativeCurrency: ETH,
    urls: [
      process.env.INFURA_KEY ? `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}` : '',
      'https://cloudflare-eth.com',
    ].filter((url) => url !== ''),
  },
  [CHAIN_IDS.BSC_MAINNET]: {
    name: 'BSC Mainnet',
    blockExplorerUrls: ['https://bscscan.com'],
    nativeCurrency: BNB,
    urls: [
      'https://bsc-dataseed.binance.org/',
      'https://bsc-dataseed1.binance.org/',
      'https://bsc-dataseed1.defibit.io/',
      'https://bsc-dataseed2.defibit.io/',
      'https://bsc-dataseed1.ninicoin.io/',
      'https://bsc-dataseed2.ninicoin.io/',
    ],
  },
  [CHAIN_IDS.BSC_TESTNET]: {
    name: 'BSC Testnet',
    blockExplorerUrls: ['https://testnet.bscscan.com'],
    nativeCurrency: BNB,
    urls: [
      'https://data-seed-prebsc-1-s1.binance.org:8545/',
      // 'https://data-seed-prebsc-2-s1.binance.org:8545/',
      'https://data-seed-prebsc-1-s2.binance.org:8545/',
      'https://data-seed-prebsc-2-s2.binance.org:8545/',
      'https://data-seed-prebsc-1-s3.binance.org:8545/',
      'https://data-seed-prebsc-2-s3.binance.org:8545/',
    ],
    isTestnet: true,
  },
  [CHAIN_IDS.LOCALHOST]: {
    name: 'ETH Mainnet',
    blockExplorerUrls: ['https://etherscan.io'],
    nativeCurrency: ETH,
    urls: [
      'http://localhost:8545'
    ].filter((url) => url !== ''),
  },
};

export { CHAINS, CHAIN_IDS, getAddChainParameters };
