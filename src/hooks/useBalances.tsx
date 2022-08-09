import { useEffect, useState } from 'react';
import { FetchingStatus } from 'src/constants';
import { useCacheContext, useCacheData } from 'src/contexts/cache-context';
import { Bep20__factory } from 'src/contracts/typechain';
import { EthersBigNumber } from 'src/global';
import { BN, isAddress } from 'src/utils';
import { useMulticall } from './multicall';

const BEP20Interface = Bep20__factory.createInterface();

export function useTokenBalances(address?: string, tokenAddresses?: (string | undefined)[]) {
  const [status, setStatus] = useState<FetchingStatus>(FetchingStatus.IDLE);
  const { assign } = useCacheContext();
  const balances = useCacheData('balances', {});
  const multicall = useMulticall();

  const fetch = async () => {
    if (status === FetchingStatus.SUCCESS) {
      setStatus(FetchingStatus.UPDATING);
    } else if (status === FetchingStatus.FAILED || status === FetchingStatus.IDLE) {
      setStatus(FetchingStatus.FETCHING);
    }
    try {
      const validTokenAddresses: string[] = tokenAddresses?.filter((t?: string): t is string => isAddress(t)) ?? [];
      const { data } = await multicall.default([
        {
          interface: BEP20Interface,
          calls: validTokenAddresses
            .map((t) => [
              { target: t, method: BEP20Interface.getFunction('balanceOf'), params: [address] },
              { target: t, method: BEP20Interface.getFunction('decimals') },
            ])
            .flat(),
        },
      ]);
      if (data) {
        assign(
          'balances',
          ...validTokenAddresses.map((address, i) => ({
            [address.toLowerCase()]: BN((data[0][i * 2][0] as EthersBigNumber).toString())
              .div(BN(10).pow(data[0][i * 2 + 1][0]))
              .toFixed(),
          }))
        );
        // setBalances(
        //   validTokenAddresses.reduce<{ [address: string]: BalanceData }>((acc, t, i) => {
        //     acc[t] = {
        //       value: BN((data[0][i * 2][0] as EthersBigNumber).toString())
        //         .div(BN(10).pow(data[0][i * 2 + 1][0]))
        //         .toFixed(),
        //       decimals: data[0][i * 2 + 1][0],
        //     };
        //     return acc;
        //   }, {})
        // );
      }
      setStatus(FetchingStatus.SUCCESS);
    } catch (error) {
      console.error('Failed to fetch balances', error);
      setStatus(FetchingStatus.FAILED);
      // setBalances({});
    }
  };

  useEffect(() => {
    fetch();
  }, [address, tokenAddresses, multicall]);

  return {
    balances,
    loading: status === FetchingStatus.FETCHING || status === FetchingStatus.IDLE,
    status,
    refresh: fetch,
  };
}
