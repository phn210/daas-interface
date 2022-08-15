import { Provider } from '@ethersproject/providers';
import { Contract, Signer } from 'ethers';
import { useMemo } from 'react';
import { useAppContext } from 'src/contexts/app-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import {
  DAOFactory,
  DAOFactory__factory,
  ERC20Votes,
  ERC20Votes__factory,
  ERC721Votes,
  ERC721Votes__factory,
  Governor,
  Governor__factory,
  Multicall,
  Multicall__factory,
  Timelock,
  Timelock__factory,
  Votes,
  Votes__factory
} from 'src/contracts/typechain';

const ZERO_ADDRESS = '0x'+'0'.repeat(40);

export function useContract<T extends Contract>(
  address?: string,
  connect?: (_address: string, _signerOrProvider: Signer | Provider) => T,
  withSigner?: boolean
): T | null {
  const { chain, address: account, web3Provider, rpcProvider } = useWeb3Context();

  return useMemo<T | null>(() => {
    const provider = withSigner ? web3Provider : rpcProvider;
    if (!address || !connect || !chain || !provider) return null;
    try {
      return connect(address, account ? provider.getSigner(account) : provider);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [chain, account, withSigner, address, connect]);
}

export function useContractGetter() {
  const { chain, address: account, web3Provider, rpcProvider } = useWeb3Context();

  return useMemo(
    () =>
      function getter<T extends Contract>(
        address?: string,
        connect?: (_address: string, _signerOrProvider: Signer | Provider) => T,
        withSigner?: boolean
      ): T | null {
        const provider = withSigner ? web3Provider : rpcProvider;
        if (!address || !connect || !chain || !provider) return null;
        try {
          return connect(address, account ? provider.getSigner(account) : provider);
        } catch (error) {
          console.error('Failed to get contract', error);
          return null;
        }
      },
    [chain, account]
  );
}

export function useMulticallContract() {
  const { contractAddresses } = useAppContext();
  return useContract<Multicall>(contractAddresses.MULTICALL_ADDRESS, Multicall__factory.connect);
}

export function useDAOFactoryContract(address?: string, withSigner?: boolean) {
  return useContract<DAOFactory>(
    address ?? ZERO_ADDRESS, 
    DAOFactory__factory.connect,
    withSigner
  );
}

export function useGovernorContract(address?: string, withSigner?: boolean) {
  return useContract<Governor>(
    address ?? ZERO_ADDRESS, 
    Governor__factory.connect,
    withSigner
  );
}

export function useTimelockContract(address?: string, withSigner?: boolean) {
  return useContract<Timelock>(
    address ?? ZERO_ADDRESS, 
    Timelock__factory.connect, 
    withSigner
  );
}

export function useERC20VotesContract(address?: string, withSigner?: boolean) {
  return useContract<ERC20Votes>(
    address ?? ZERO_ADDRESS,
    ERC20Votes__factory.connect,
    withSigner
  );
}

export function useERC721VotesContract(address?: string, withSigner?: boolean) {
  return useContract<ERC721Votes>(
    address ?? ZERO_ADDRESS, 
    ERC721Votes__factory.connect,
    withSigner
  );
}

export function useVotesContract(address?: string, withSigner?: boolean) {
  return useContract<Votes>(
    address ?? ZERO_ADDRESS,
    Votes__factory.connect,
    withSigner
  )
}
