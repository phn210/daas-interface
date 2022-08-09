/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useMulticall } from 'src/hooks/multicall';
import { Ve__factory, IValuator__factory } from 'src/contracts/typechain';
import { useAppContext } from '../app-context';
import { useCacheContext } from '../cache-context';
import { BN } from 'src/utils';
import { useVeContract } from 'src/hooks/useContract';
import BigNumber from 'bignumber.js';
import { dashboardClient } from 'src/configs/api';
import { BASE18 } from 'src/constants';

export interface DashboardContextProps {
  loading: boolean;
  data: any;
  error: Error | undefined;
  fetchData?: () => void;
}
const bodyResponseFn = (res: any) => res.data;
const DashboardContext = createContext<DashboardContextProps>({
  loading: false,
  data: {},
  error: undefined,
});

export function DashboardProvider({ children }: { children: ReactNode }) {
  const multicall = useMulticall();
  const { contractAddresses } = useAppContext();
  const veContract = useVeContract();
  const client = dashboardClient;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const { push, select } = useCacheContext();
  const fetchVotingPowerNDays = async (n_days: number) => {
    const res = await client.get('/voting-power', { params: n_days > 0 ? { n_days } : {} }).then(bodyResponseFn);
    const result = res?.voting_logs;

    return result;
  };

  const fetchTimeLockHistogram = async () => {
    const res = await client.get('/histogram/time-lock').then(bodyResponseFn);
    const result = res?.time_lock_histogram;
    return result;
  };

  const fetchVotingPowerHistogram = async () => {
    const res = await client.get('/histogram/voting-power').then(bodyResponseFn);
    const result = {
      topWallets: res?.top_wallets,
      votingPowerHistogram: res?.voting_power_histogram,
    };
    return result;
  };

  const fetchOverview = async () => {
    const result = await client.get('/overview').then(bodyResponseFn);
    return result;
  };
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [overview, timeLockHistogram, votingPowerHistogram] = await Promise.all([
        fetchOverview(),
        fetchTimeLockHistogram(),
        fetchVotingPowerHistogram(),
      ]);
      push('dashboard.data.overview', overview);
      push('dashboard.data.timeLockHistogram', timeLockHistogram);
      push('dashboard.data.votingPowerHistogram', votingPowerHistogram.votingPowerHistogram);
      push('dashboard.data.topWallets', votingPowerHistogram.topWallets);

      const veInterface = Ve__factory.createInterface();
      const valuatorInterface = IValuator__factory.createInterface();
      const totalSupplyInfo = await multicall.default([
        {
          interface: veInterface,
          calls: [
            {
              target: contractAddresses.VE_TRAVA_ADDRESS,
              method: veInterface?.getFunction('totalSupply'),
            },
            {
              target: contractAddresses.VE_TRAVA_ADDRESS,
              method: veInterface?.getFunction('decimals'),
            },
          ],
        },
      ]);
      const data = totalSupplyInfo?.data;
      if (data && data.length >= 1 && data[0]) {
        push(
          'dashboard.data.veOverview.voting_power',
          BN(data[0][0].toString()).dividedBy(BN(10).exponentiatedBy(data[0][1])).toFixed(2)
        );
      }
      const allToken = await veContract?.getAllToken();
      let tokenAddresses: string[] = allToken ? allToken : [];
      let trava;
      let rTrava;
      if (tokenAddresses?.includes(contractAddresses.TRAVA_TOKEN_ADDRESS)) {
        trava = await veContract?.totalTokenLocked(contractAddresses.TRAVA_TOKEN_ADDRESS);
      }
      if (tokenAddresses?.includes(contractAddresses.RTRAVA_TOKEN_ADDRESS)) {
        rTrava = await veContract?.totalTokenLocked(contractAddresses.RTRAVA_TOKEN_ADDRESS);
      }
      tokenAddresses = tokenAddresses?.filter(
        (token) => token !== contractAddresses.TRAVA_TOKEN_ADDRESS && token !== contractAddresses.RTRAVA_TOKEN_ADDRESS
      );
      const { data: lpLocked } = await multicall.default([
        {
          interface: veInterface,
          calls: tokenAddresses.map((token) => ({
            target: contractAddresses.VE_TRAVA_ADDRESS,
            method: veInterface.getFunction('totalTokenLocked'),
            params: [token],
          })),
        },
      ]);
      if (lpLocked && lpLocked.length > 0) {
        const lp = lpLocked[0];
        const { data: lpValues } = await multicall.default([
          {
            interface: valuatorInterface,
            calls: tokenAddresses.map((token, index) => ({
              target: contractAddresses.LP_VALUATOR_ADDRESS,
              method: valuatorInterface.getFunction('valuation'),
              params: [token, lp[index][0]],
            })),
          },
        ]);

        if (lpValues && lpValues.length > 0 && lpValues[0].length > 0) {
          let voted_locked = BN(0);
          if (trava) voted_locked = voted_locked.plus(BN(trava.toString()));
          if (rTrava) voted_locked = voted_locked.plus(BN(rTrava.toString()));

          voted_locked = lpValues[0].reduce(
            (total: BigNumber, lpValue: any) => total.plus(BN(lpValue[0]?.toString()).dividedBy(2)),
            voted_locked
          );
          push('dashboard.data.veOverview.voted_locked', voted_locked.dividedBy(BASE18).toFixed(2));
        }
      }
      const votingPowers = await Promise.all([
        fetchVotingPowerNDays(7),
        fetchVotingPowerNDays(30),
        fetchVotingPowerNDays(365),
        fetchVotingPowerNDays(0),
      ]);
      if (votingPowers && votingPowers.length === 4) {
        push('dashboard.data.voting_powers', votingPowers);
      }
    } catch (err) {
      console.error(err);
      setError(err as Error);
    }
    setLoading(false);
  }, [multicall, contractAddresses]);

  useEffect(() => {
    if (select('dashboard.data') === undefined) {
      fetchData();
    }
  }, [fetchData]);

  const contextData = useMemo(
    () => ({
      loading,
      data: select('dashboard.data'),
      error,
      fetchData,
    }),
    [loading, error, fetchData]
  );
  return <DashboardContext.Provider value={contextData}>{children}</DashboardContext.Provider>;
}

export const useDashboardContext = () => useContext(DashboardContext);
