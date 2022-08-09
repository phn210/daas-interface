/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect } from 'react';
import { BASE18 } from 'src/constants';
import { useAppContext } from 'src/contexts/app-context';
import { useCacheContext } from 'src/contexts/cache-context';
import { IValuator__factory } from 'src/contracts/typechain';
import { BigNumberish } from 'src/global';
import { BN, isAddress } from 'src/utils';
import { useContractGetter } from './useContract';

interface UseFeedTokenRatioData {
  ratio: number;
  /**
   * Get the corresponding number of trava with given token
   * @param tokenAddress - The contract address of given token
   */
  getTokenRatio: (tokenAddress: string) => Promise<BigNumberish>;
}

export default function useFeedTokenRatio(tokenAddress?: string): UseFeedTokenRatioData {
  const { select, push } = useCacheContext();
  const { contractAddresses: cAddrs } = useAppContext();
  const getContract = useContractGetter();
  const ratio: number = tokenAddress ? select(`tokenRatio.${tokenAddress.toLowerCase()}`) : NaN;

  const isNormalToken = (address: string) => {
    return [cAddrs.TRAVA_TOKEN_ADDRESS.toLowerCase(), cAddrs.RTRAVA_TOKEN_ADDRESS.toLowerCase()].includes(
      address.toLowerCase()
    );
  };

  const getTokenRatio = async (tokenAddress: string): Promise<BigNumberish> => {
    if (!isAddress(tokenAddress)) throw new Error('address is invalid');
    const path = `tokenRatio.${tokenAddress.toLowerCase()}`;
    let ratio = select(path);
    if (ratio === undefined) {
      if (cAddrs.TRAVA_TOKEN_ADDRESS.toLowerCase() === tokenAddress.toLowerCase()) {
        ratio = 1;
      } else {
        const valuatorAddress = isNormalToken(tokenAddress)
          ? cAddrs.TOKEN_VALUATOR_ADDRESS
          : cAddrs.LP_VALUATOR_ADDRESS;
        const ratioRaw = await getContract(valuatorAddress, IValuator__factory.connect)!.ratio(tokenAddress);
        ratio = BN(ratioRaw._hex).div(BASE18).toNumber();
      }
      // save to cache
      push(path, ratio);
    }
    return ratio as BigNumberish;
  };

  useEffect(() => {
    if (isAddress(tokenAddress)) {
      getTokenRatio(tokenAddress as string);
    }
  }, [tokenAddress, getContract]);

  return { ratio, getTokenRatio };
}
