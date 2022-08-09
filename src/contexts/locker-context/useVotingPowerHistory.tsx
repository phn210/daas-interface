/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { dashboardClient } from 'src/configs/api';
import { BASE18, FetchingStatus } from 'src/constants';
import { useVeContract } from 'src/hooks/useContract';
import { BN } from 'src/utils';
import { useCacheContext, useCacheData } from '../cache-context';
import { useWeb3Context } from '../web3-context';
import { VotingLogs } from './types';

export interface UseVotingPowerHistoryData {
  status: FetchingStatus;
  data: {
    currentVotingPower?: number | string;
    votingLogs?: VotingLogs;
    // veNFTs?: any
    days?: number; // used as param pass to api
  };
  error?: Error;
  fetch: (_days?: number) => Promise<void>;
  fetchCurrentVotingPower: () => Promise<void>;
}

export default function useVotingPowerHistory(): UseVotingPowerHistoryData {
  const [status, setStatus] = useState<FetchingStatus>(FetchingStatus.IDLE);
  const [error, setError] = useState<Error | undefined>();
  const { address } = useWeb3Context();
  const { push, clear } = useCacheContext();
  const data = useCacheData('locker.data.votingPowerHistory', {});
  const veContract = useVeContract();

  const fetchData = async (days?: number) => {
    if (status === FetchingStatus.IDLE || status === FetchingStatus.FAILED) {
      setStatus(FetchingStatus.FETCHING);
    } else {
      setStatus(FetchingStatus.UPDATING);
    }
    try {
      const history = await dashboardClient
        .get(`/voting-power/${address}`, {
          params: { n_days: days, refresh: true },
        })
        .then((res) => res.data);
      push('locker.data.votingPowerHistory.votingLogs', {
        categories: Object.keys(history.voting_logs).map((item) => Number(item) * 1000),
        votingPower: Object.values(history.voting_logs).map((item: any) => item.voting_power),
        percentage: Object.values(history.voting_logs).map((item: any) => item.voting_power_percent),
      });
      setError(undefined);
      setStatus(FetchingStatus.SUCCESS);
    } catch (error) {
      setError(error as Error);
      setStatus(FetchingStatus.FAILED);
    }
  };

  const fetchCurrentVotingPower = async () => {
    try {
      if (!veContract || !address) {
        throw new Error();
      }
      const votingPower = await veContract.votingPowerOfUser(address);
      push('locker.data.votingPowerHistory.currentVotingPower', BN(votingPower._hex).div(BASE18).toString());
    } catch (error) {
      clear('locker.data.votingPowerHistory.currentVotingPower');
    }
  };

  useEffect(() => {
    fetchCurrentVotingPower();
  }, [address, veContract]);

  return { status, data, error, fetch: fetchData, fetchCurrentVotingPower } as UseVotingPowerHistoryData;
}
