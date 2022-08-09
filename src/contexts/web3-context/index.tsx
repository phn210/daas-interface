import {
  ExternalProvider,
  JsonRpcProvider,
  StaticJsonRpcProvider,
  Web3Provider as Web3EthereumProvider,
} from '@ethersproject/providers';
import { MetaMask } from '@web3-react/metamask';
import { Actions, ProviderRpcError, Web3ReactStateUpdate } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import DevTool from 'src/components/DevTool';
import { isEnableDevTools } from 'src/constants';
import { isAddress } from 'src/utils';
import { CHAINS, ExtendedChainInformation, getAddChainParameters } from './chains';
import { Web3ConnectState } from './types';
import useBestRpc from './useBestRpc';
import {
  CONNECTOR_TYPES,
  getStoredChainId,
  getStoredConnector,
  getStoredMockAddress,
  setStoredConnector,
  setStoredMockAddress,
} from './utils';

export interface Web3ProviderData {
  chain?: ExtendedChainInformation & { chainId: number };
  address?: string;
  activating?: boolean;
  error?: Error;
  web3Provider?: Web3EthereumProvider;
  rpcProvider?: JsonRpcProvider;
  connectMetaMask: () => Promise<void>;
  connectWalletConnect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (_chainId?: number) => Promise<void>;
  getAddressExplorerLink: (_address: string) => string;
  getTransactionExplorerLink: (_txHash: string) => string;
}

interface Web3ProviderProps {
  children?: React.ReactNode;
  allowedChainIds: number[];
  defaultChainId: number;
  autoSwitchNetwork?: boolean;
}

const Web3Context = createContext({} as Web3ProviderData);
let nullifier = 0;

export function Web3Provider({ children, allowedChainIds, defaultChainId, autoSwitchNetwork }: Web3ProviderProps) {
  const DEFAULT_STATE = {
    chainId: defaultChainId,
    accounts: [],
    activating: false,
    error: undefined,
  };
  const [web3State, setWeb3State] = useState<Web3ConnectState>(DEFAULT_STATE);
  const [mockAddress, setMockAddress] = useState<string | undefined>(getStoredMockAddress());

  const chain = useMemo<ExtendedChainInformation & { chainId: number }>(() => {
    return { ...CHAINS[web3State.chainId], chainId: web3State.chainId };
  }, [web3State.chainId, defaultChainId]);

  const bestRpc = useBestRpc(chain.urls);

  const startActivation: () => void = () => {
    const nullifierCached = ++nullifier;

    setWeb3State({ ...DEFAULT_STATE, activating: true });

    // return a function that cancels the activation if nothing else has happened
    return () => {
      if (nullifier === nullifierCached) {
        setWeb3State({ ...DEFAULT_STATE, activating: false });
      }
    };
  };

  const _validateChainId = (chainId?: Web3ConnectState['chainId']) => {
    if (
      chainId !== undefined &&
      !allowedChainIds.some((allowedChainId) => Number(allowedChainId) === Number(chainId))
    ) {
      const allowedNetworkNames = allowedChainIds.map((chainId) => CHAINS[Number(chainId)].name);
      throw new Error(
        `Network is not supported. Please switch to ${
          allowedChainIds.length > 1 ? 'one of the following networks' : ''
        } ${allowedNetworkNames.join(', ')}`
      );
    }
  };

  const update = (newState: Web3ReactStateUpdate) => {
    try {
      _validateChainId(newState.chainId);
    } catch (error) {
      reportError(error as Error);
      //
      if (autoSwitchNetwork) {
        // switch to default network
        switchChain();
      }
      return;
    }

    nullifier++;

    setWeb3State((currentState) => {
      const chainId = newState.chainId ?? currentState.chainId;
      const accounts = newState.accounts ?? currentState.accounts;

      // ensure that the error is cleared when appropriate
      let error = currentState.error;
      if (error && chainId && accounts) {
        error = undefined;
      }

      // ensure that the activating flag is cleared when appropriate
      let activating = currentState.activating;
      if (activating && (error || chainId || accounts)) {
        activating = false;
      }

      return { chainId, accounts, activating, error };
    });
  };

  const reportError = (error: Web3ConnectState['error']) => {
    nullifier++;
    // metamask error, show when user tries to switch network
    // if error code is 1013, ignore this
    if (
      error &&
      (error as ProviderRpcError)?.code === 1013 &&
      error.message === 'MetaMask: Disconnected from chain. Attempting to connect.'
    ) {
      return;
    }
    setWeb3State((currentState) => {
      // we don't want reset current network to default
      const chainId = currentState.chainId ?? defaultChainId;
      return { ...DEFAULT_STATE, chainId, error };
    });
  };

  const connectors = useMemo(() => {
    const actions = {
      startActivation,
      update,
      reportError,
    } as Actions;

    const metamask = new MetaMask(actions, false);
    const walletConnect = new WalletConnect(
      actions,
      {
        rpc: allowedChainIds.reduce((accumulator: { [chainId: number]: string[] }, chainId: number) => {
          accumulator[chainId] = CHAINS[Number(chainId)].urls;
          return accumulator;
        }, {}),
      },
      false
    );

    return {
      metamask,
      walletConnect,
    };
  }, [defaultChainId, allowedChainIds]);

  const connectMetaMask = async () => {
    try {
      setStoredConnector(CONNECTOR_TYPES.METAMASK);
      await connectors.metamask.activate();
    } catch (error) {
      reportError(error as Error);
      setStoredConnector(undefined);
    }
  };

  const connectWalletConnect = async () => {
    try {
      const storedChainId = getStoredChainId();
      const chainId = storedChainId === null ? defaultChainId : storedChainId;
      setStoredConnector(CONNECTOR_TYPES.WALLET_CONNECT);
      await connectors.walletConnect.activate(chainId);
    } catch (error) {
      reportError(error as Error);
      setStoredConnector(undefined);
    }
  };

  const _getConnector = () => {
    const storedConnector = getStoredConnector();
    if (storedConnector === CONNECTOR_TYPES.METAMASK) {
      return connectors.metamask;
    } else if (storedConnector === CONNECTOR_TYPES.WALLET_CONNECT) {
      return connectors.walletConnect;
    }
    return null;
  };

  const _getAddress = (): string | undefined => {
    if (isEnableDevTools && isAddress(mockAddress)) {
      return mockAddress;
    }
    return web3State.accounts[0];
  };

  const setMockAddressProxy = (mockAddress?: string) => {
    setStoredMockAddress(mockAddress);
    setMockAddress(mockAddress);
  };

  const switchChain = async (chainId?: number) => {
    if (chainId === undefined) {
      chainId = defaultChainId;
    }
    const connector = _getConnector();
    if (connector instanceof MetaMask) {
      const chainParams = getAddChainParameters(chainId);
      await connector.activate(chainParams);
    } else if (connector instanceof WalletConnect) {
      await connector.activate(chainId);
    }
  };

  const disconnect = async () => {
    await connectors.metamask.deactivate();
    await connectors.walletConnect.deactivate();
    setStoredConnector(undefined);
  };

  const getAddressExplorerLink = (address: string) => {
    return `${chain.blockExplorerUrls?.[0]}/address/${address}`;
  };

  const getTransactionExplorerLink = (txHash: string) => {
    return `${chain.blockExplorerUrls?.[0]}/tx/${txHash}`;
  };

  useEffect(() => {
    // try connect to wallet
    const connector = _getConnector();
    if (connector) {
      connector.connectEagerly();
    }
  }, []);

  const web3Provider = useMemo<Web3EthereumProvider | undefined>(() => {
    const connector = _getConnector();
    if (connector && connector.provider) {
      return new Web3EthereumProvider(connector.provider as ExternalProvider);
    }
    return undefined;
  }, [web3State.accounts, chain, connectors]);

  const rpcProvider = useMemo<JsonRpcProvider>(() => {
    return new StaticJsonRpcProvider(chain.urls.includes(bestRpc ?? '') ? bestRpc : chain.urls[0]);
  }, [bestRpc, chain]);

  const contextData = useMemo<Web3ProviderData>(() => {
    return {
      error: web3State.error,
      activating: web3State.activating,
      chain,
      address: _getAddress(),
      // address: '0x19dC1238669a0Dd01C25f81Ec4972428EED41C00',
      web3Provider,
      rpcProvider,
      disconnect,
      switchChain,
      connectMetaMask,
      connectWalletConnect,
      getAddressExplorerLink,
      getTransactionExplorerLink,
    };
  }, [web3State, chain, connectors, mockAddress, isEnableDevTools, web3Provider, rpcProvider]);

  return (
    <Web3Context.Provider value={contextData}>
      {children}
      {isEnableDevTools && <DevTool mockAddress={mockAddress} setMockAddress={setMockAddressProxy} />}
    </Web3Context.Provider>
  );
}

export const useWeb3Context = () => {
  const ctx = useContext<Web3ProviderData>(Web3Context);
  if (!ctx) throw Error('useWeb3Context can only be used within the Web3Provider component');
  return ctx;
};
