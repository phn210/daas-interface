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
  FeedTokenRatio,
  FeedTokenRatio__factory,
  Governor,
  Governor__factory,
  GovernorDelegate,
  GovernorDelegate__factory,
  Incentive,
  Incentive__factory,
  Lottery,
  Lottery__factory,
  Multicall,
  Multicall__factory,
  SwapFactory,
  SwapFactory__factory,
  Timelock,
  Timelock__factory,
  Ve,
  Ve__factory,
  VotingStrategy,
  VotingStrategy__factory,
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

export function useVeContract(withSigner?: boolean) {
  const { contractAddresses } = useAppContext();
  return useContract<Ve>(contractAddresses.VE_TRAVA_ADDRESS, Ve__factory.connect, withSigner);
}

export function useIncentiveContract(withSigner?: boolean) {
  const { contractAddresses } = useAppContext();
  return useContract<Incentive>(contractAddresses.INCENTIVE_VAULT_ADDRESS, Incentive__factory.connect, withSigner);
}

export function useMulticallContract() {
  const { contractAddresses } = useAppContext();
  return useContract<Multicall>(contractAddresses.MULTICALL_ADDRESS, Multicall__factory.connect);
}

export function useFeedTokenRatioContract() {
  const { contractAddresses } = useAppContext();
  return useContract<FeedTokenRatio>(contractAddresses.FEED_TOKEN_RATIO_ADDRESS, FeedTokenRatio__factory.connect);
}

export function useSwapFactoryContract() {
  const { contractAddresses } = useAppContext();
  return useContract<SwapFactory>(contractAddresses.SWAP_FACTORY_ADDRESS, SwapFactory__factory.connect);
}

export function useGovernorDelegateContract(withSigner?: boolean) {
  const { contractAddresses } = useAppContext();
  return useContract<GovernorDelegate>(
    contractAddresses.GOVERNOR_DELEGATE_ADDRESS,
    GovernorDelegate__factory.connect,
    withSigner
  );
}

export function useVotingStrategyContract(withSigner?: boolean) {
  const { contractAddresses } = useAppContext();
  return useContract<VotingStrategy>(
    contractAddresses.VOTING_STRATEGY_ADDRESS,
    VotingStrategy__factory.connect,
    withSigner
  );
}

export function useLotteryContract() {
  const { contractAddresses } = useAppContext();
  return useContract<Lottery>(contractAddresses.LOTTERY_ADDRESS, Lottery__factory.connect);
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

export function useVotesContract(address?: string, standard?: number, withSigner?: boolean) {
  if (standard == 0) {
    return useERC20VotesContract(address, withSigner);
  } else if (standard == 1) {
    return useERC721VotesContract(address, withSigner);
  } else return null;
}
