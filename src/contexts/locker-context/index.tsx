/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState } from 'react';
import { BASE, BASE18, FetchingStatus, SYMBOLS } from 'src/constants';
import { calcUnlockTime } from 'src/contracts/utils';
import { BaseContextProps, BigNumberish, EthersBigNumber, TokenMeta } from 'src/global';
import { useMulticall } from 'src/hooks/multicall';
import { useIncentiveContract, useVeContract } from 'src/hooks/useContract';
import useFeedTokenRatio from 'src/hooks/useFeedTokenRatio';
import useHelperFunctions from 'src/hooks/useHelperFunctions';
import { MIN_LOCK_TIME } from 'src/pages/Locker/config';
import { BN } from 'src/utils';
import { useCacheContext, useCacheData } from '../cache-context';
import { useWeb3Context } from '../web3-context';
import { VeNFT } from './types';
import useVotingPowerHistory, { UseVotingPowerHistoryData } from './useVotingPowerHistory';

function getNormalizedVeNFTData({
  claimableRewardRaw,
  veNFTVotingPowerRawAtT,
  warmUpRewardRaw,
  isUseWarmup,
  totalVP,
  eps,
  token,
  now,
  roundedTime,
  locked,
  votingPowerRaw,
}: {
  claimableRewardRaw?: BigNumberish;
  veNFTVotingPowerRawAtT?: BigNumberish;
  warmUpRewardRaw?: BigNumberish;
  isUseWarmup?: boolean;
  totalVP?: BigNumberish;
  eps?: BigNumberish;
  token?: TokenMeta;
  now?: number;
  roundedTime?: number;
  locked?: any;
  votingPowerRaw?: BigNumberish;
}): VeNFT {
  const out = {} as VeNFT;
  if (claimableRewardRaw) {
    out.claimable = BN(claimableRewardRaw).div(BASE.TRAVA).toString();
  }
  if (veNFTVotingPowerRawAtT && now && roundedTime && totalVP && eps) {
    out.unclaimable = isUseWarmup
      ? BN(warmUpRewardRaw).div(BASE.TRAVA).toString()
      : BN(totalVP).eq(0)
      ? '0'
      : BN(veNFTVotingPowerRawAtT)
          .times(now - roundedTime)
          .div(totalVP)
          .times(eps)
          .toString();
  }
  if (out.claimable && out.unclaimable) {
    out.reward = BN(out.claimable).plus(out.unclaimable).toString();
  }
  if (locked && token) {
    const base = BN(10).pow(token.decimals);
    out.amount = BN(locked.amount._hex).div(base).toString();
    out.balance = out.amount; // compatibility with previous code
    out.rewardAmount = BN(locked.rewardAmount._hex).div(BASE.TRAVA).toString();
    out.endTime = (locked.end as EthersBigNumber).mul(1000).toNumber();
    out.token = locked.token;
    out.tokenSymbol = SYMBOLS[token.symbol] ?? token.symbol;
  }
  if (votingPowerRaw) {
    out.votingPower = BN(votingPowerRaw).div(BASE18).toString();
  }
  return out;
}

function getTime(): {
  now: number;
  roundedTime: number;
} {
  const now = Math.floor(new Date().getTime() / 1000);
  // time round to MIN_LOCK_TIME
  // const roundedTime = parseInt(Number(now / MIN_LOCK_TIME).toString()) * MIN_LOCK_TIME;
  const roundedTime = calcUnlockTime(now, 0);
  return {
    now,
    roundedTime,
  };
}

interface LockerContextData {
  status: FetchingStatus;
  data: {
    veNFTList: { [id: string]: VeNFT };
    votingPowerHistory: UseVotingPowerHistoryData['data'];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  fetch: (withLoading?: boolean) => Promise<void>;
  removeVeNFT: (_tokenId: string | number) => Promise<void>;
  refreshVeNFTList: () => Promise<void>;
  updateVeNFT: (_tokenId: string | number) => Promise<void>;
  votingPowerStatus: UseVotingPowerHistoryData['status'];
  votingPowerError?: UseVotingPowerHistoryData['error'];
  fetchVotingPowerHistory: UseVotingPowerHistoryData['fetch'];
  fetchCurrentVotingPower: UseVotingPowerHistoryData['fetchCurrentVotingPower'];
}
const LockerContext = createContext({} as LockerContextData);

export function LockerProvider({ children }: BaseContextProps) {
  const { address } = useWeb3Context();
  const [status, setStatus] = useState<FetchingStatus>(FetchingStatus.IDLE);
  const [error, setError] = useState<Error | undefined>();
  const {
    status: votingPowerStatus,
    error: votingPowerError,
    fetch: fetchVotingPowerHistory,
    fetchCurrentVotingPower,
  } = useVotingPowerHistory();
  const data = useCacheData('locker.data', {});
  const { push, clear, assign } = useCacheContext();
  const veContract = useVeContract();
  const incentiveContract = useIncentiveContract();
  const multicall = useMulticall();
  const { getToken } = useHelperFunctions();
  const { getTokenRatio } = useFeedTokenRatio();

  const fetchData = async (withLoading?: boolean) => {
    try {
      if (!address || !veContract || !incentiveContract) {
        throw new Error('Connection error');
      }
      if (withLoading || status === FetchingStatus.IDLE || status === FetchingStatus.FAILED) {
        setStatus(FetchingStatus.FETCHING);
      } else {
        setStatus(FetchingStatus.UPDATING);
      }

      const { now, roundedTime } = getTime();
      const { data: gData } = await multicall.default([
        {
          interface: veContract.interface,
          calls: [
            {
              target: veContract.address,
              method: veContract.interface.getFunction('getveNFTOfUser'),
              params: [address],
            },
            {
              target: veContract.address,
              method: veContract.interface.getFunction('totalSupplyAtT'),
              params: [roundedTime],
            },
          ],
        },
        {
          interface: incentiveContract.interface,
          calls: [
            {
              target: incentiveContract.address,
              method: incentiveContract.interface.getFunction('emissionPerSecond'),
            },
          ],
        },
      ]);
      // list veNFTIds of user
      const veNFTIds = gData[0][0][0] as Array<EthersBigNumber>;
      // total voting power of system at roundedTime
      const totalVP = (gData[0][1][0] as EthersBigNumber).toString();
      // emission per second - number of trava emit per second
      const eps = BN(gData[1][0][0]._hex).div(BASE.TRAVA);

      const { data } = await multicall.default([
        {
          interface: veContract.interface,
          calls: veNFTIds
            .map((id) => [
              {
                target: veContract.address,
                method: veContract.interface.getFunction('tokenURI'),
                params: [id],
              },
              {
                target: veContract.address,
                method: veContract.interface.getFunction('balanceOfNFT'),
                params: [id],
              },
              {
                target: veContract.address,
                method: veContract.interface.getFunction('locked'),
                params: [id],
              },
              {
                target: veContract.address,
                method: veContract.interface.getFunction('user_point_history__ts'),
                params: [id, 1],
              },
            ])
            .flat(),
        },
        {
          interface: incentiveContract.interface,
          calls: veNFTIds
            .map((id) => [
              // get claimable reward of veNFT
              {
                target: incentiveContract.address,
                method: incentiveContract.interface.getFunction('claimable'),
                params: [id],
              },
              // voting power of veNFT at roundedTime
              {
                target: incentiveContract.address,
                method: incentiveContract.interface.getFunction('ve_for_at'),
                params: [id, roundedTime],
              },
              {
                target: incentiveContract.address,
                method: incentiveContract.interface.getFunction('claimWarmUpReward'),
                params: [id],
              },
            ])
            .flat(),
        },
      ]);

      // In veContract
      // each veNFT corresponds to 4 elements (veSize) in the returned result (veNFTData)
      // veSize * i - encoded metadata of veNFT i-th (in base64)
      // veSize * i + 1 - current voting power right now of veNFT i-th
      // veSize * i + 2 - the locked info of veNFT i-th, includes rewardAmount, amount to lock, end time, token to lock
      // veSize * i + 3 - warmup timestamp
      const veNFTData = data[0];
      const veSize = 4;
      // In incentiveContract
      // each veNFT corresponds to 3 elements in the returned result (incentiveData)
      // 3 * i - the user's claimable reward in veNFT i-th
      // 3 * i + 1 - the voting power of veNFT i-th at roundedTime
      // 3 * i + 2 - the warm up reward of veNFT i-th
      const incentiveData = data[1];
      const incentiveSize = 3;
      // get all token address then get its metadata and ratio
      const uniqueTokenAddresses = veNFTIds
        .map((_, i) => veNFTData[i * veSize + 2].token) // get all addresses
        .filter((val, idx, arr) => arr.indexOf(val) === idx); // filter to get unique addresses
      // get token metadata, ratio then normalize
      const uniqueTokenMetadata = (
        await Promise.all(
          uniqueTokenAddresses.map(
            async (token: string): Promise<[TokenMeta, BigNumberish]> =>
              await Promise.all([getToken(token), getTokenRatio(token)])
          )
        )
      ).reduce<{ [address: string]: [TokenMeta, BigNumberish] }>((acc, val, i) => {
        acc[uniqueTokenAddresses[i]] = val;
        return acc;
      }, {});

      const allVeNFTData = veNFTIds.reduce<{ [id: string]: VeNFT }>((acc, veId, i) => {
        const tokenURI = veNFTData[i * veSize][0] as string;
        const locked = veNFTData[i * veSize + 2];
        acc[veId.toString()] = {
          // decode veNFT metadata from base64 to object
          ...JSON.parse(Buffer.from(tokenURI.split(',')[1], 'base64').toString()),
          ...getNormalizedVeNFTData({
            claimableRewardRaw: incentiveData[incentiveSize * i][0]._hex,
            veNFTVotingPowerRawAtT: incentiveData[incentiveSize * i + 1][0]._hex,
            warmUpRewardRaw: incentiveData[incentiveSize * i + 2][0]._hex,
            isUseWarmup: calcUnlockTime(Number(veNFTData[i * veSize + 3][0]._hex), MIN_LOCK_TIME) > now,
            votingPowerRaw: veNFTData[i * veSize + 1][0]._hex,
            locked,
            token: uniqueTokenMetadata[locked.token][0],
            eps,
            totalVP,
            now,
            roundedTime,
          }),
          tokenRatio: uniqueTokenMetadata[locked.token][1],
          id: veId.toString(),
        };
        return acc;
      }, {});

      push('locker.data.veNFTList', allVeNFTData);
      setStatus(FetchingStatus.SUCCESS);
      setError(undefined);
    } catch (error) {
      console.error('Failed to fetch locker data', error);
      setError(error as Error);
      clear('locker.data.veNFTList');
      setStatus(FetchingStatus.FAILED);
    }
  };

  const removeVeNFT = async (tokenId: string | number) => {
    // delete data.veNFTList[tokenId];
    // push('locker.data.veNFTList', { ...data.veNFTList });
    clear(`locker.data.veNFTList[${tokenId}]`);
    // refresh to ensure data is sync
    await Promise.all([fetchData(), fetchCurrentVotingPower()]);
  };

  const refreshVeNFTList = async () => {
    // update current voting power
    fetchCurrentVotingPower();
    // update reward and voting power of veNFT
    try {
      if (!veContract || !incentiveContract) return;
      const ids = Object.keys(data.veNFTList);
      if (ids.length === 0) return;

      const { now, roundedTime } = getTime();
      const { data: dataUpdate } = await multicall.default([
        {
          interface: veContract.interface,
          calls: [
            ...ids
              .map((id) => [
                {
                  target: veContract.address,
                  method: veContract.interface.getFunction('balanceOfNFT'),
                  params: [id],
                },
                {
                  target: veContract.address,
                  method: veContract.interface.getFunction('user_point_history__ts'),
                  params: [id, 1],
                },
              ])
              .flat(),
            {
              target: veContract.address,
              method: veContract.interface.getFunction('totalSupplyAtT'),
              params: [roundedTime],
            },
          ],
        },
        {
          interface: incentiveContract.interface,
          calls: [
            ...ids
              .map((id) => [
                {
                  target: incentiveContract.address,
                  method: incentiveContract.interface.getFunction('claimable'),
                  params: [id],
                },
                {
                  target: incentiveContract.address,
                  method: incentiveContract.interface.getFunction('ve_for_at'),
                  params: [id, roundedTime],
                },
                {
                  target: incentiveContract.address,
                  method: incentiveContract.interface.getFunction('claimWarmUpReward'),
                  params: [id],
                },
              ])
              .flat(),
            {
              target: incentiveContract.address,
              method: incentiveContract.interface.getFunction('emissionPerSecond'),
            },
          ],
        },
      ]);
      const totalVP = (dataUpdate[0].splice(-1)[0][0] as EthersBigNumber).toString();
      const eps = BN(dataUpdate[1].splice(-1)[0][0]._hex).div(BASE.TRAVA);
      ids.forEach((id, i) => {
        if (data.veNFTList[id]) {
          assign(
            `locker.data.veNFTList[${id}]`,
            getNormalizedVeNFTData({
              votingPowerRaw: dataUpdate[0][2 * i][0]._hex,
              claimableRewardRaw: dataUpdate[1][3 * i][0]._hex,
              veNFTVotingPowerRawAtT: dataUpdate[1][3 * i + 1][0]._hex,
              warmUpRewardRaw: dataUpdate[1][3 * i + 2][0]._hex,
              isUseWarmup: calcUnlockTime(Number(dataUpdate[0][2 * i + 1][0]._hex), MIN_LOCK_TIME) > now,
              totalVP,
              eps,
              now,
              roundedTime,
            })
          );
        }
      });
    } catch (error) {
      console.error('Failed to refresh veNFTs', error);
    }
  };

  const updateVeNFT = async (tokenId: string | number) => {
    // update current voting power
    fetchCurrentVotingPower();

    try {
      if (!veContract || !incentiveContract || !tokenId) return;

      const { now, roundedTime } = getTime();
      const { data: dataUpdate } = await multicall.default([
        {
          interface: veContract.interface,
          calls: [
            {
              target: veContract.address,
              method: veContract.interface.getFunction('balanceOfNFT'),
              params: [tokenId],
            },
            {
              target: veContract.address,
              method: veContract.interface.getFunction('locked'),
              params: [tokenId],
            },
            {
              target: veContract.address,
              method: veContract.interface.getFunction('totalSupplyAtT'),
              params: [roundedTime],
            },
            {
              target: veContract.address,
              method: veContract.interface.getFunction('user_point_history__ts'),
              params: [tokenId, 1],
            },
          ],
        },
        {
          interface: incentiveContract.interface,
          calls: [
            {
              target: incentiveContract.address,
              method: incentiveContract.interface.getFunction('claimable'),
              params: [tokenId],
            },
            {
              target: incentiveContract.address,
              method: incentiveContract.interface.getFunction('emissionPerSecond'),
            },
            {
              target: incentiveContract.address,
              method: incentiveContract.interface.getFunction('ve_for_at'),
              params: [tokenId, roundedTime],
            },
            {
              target: incentiveContract.address,
              method: incentiveContract.interface.getFunction('claimWarmUpReward'),
              params: [tokenId],
            },
          ],
        },
      ]);

      const tokenMeta = await getToken(dataUpdate[0][1].token);
      const totalVP = (dataUpdate[0][2][0] as EthersBigNumber).toString();
      const eps = BN(dataUpdate[1][1][0]._hex).div(BASE.TRAVA);

      assign(
        `locker.data.veNFTList[${tokenId}]`,
        getNormalizedVeNFTData({
          claimableRewardRaw: dataUpdate[1][0][0]._hex,
          veNFTVotingPowerRawAtT: dataUpdate[1][2][0]._hex,
          warmUpRewardRaw: dataUpdate[1][3][0]._hex,
          isUseWarmup: calcUnlockTime(Number(dataUpdate[0][3][0]._hex), MIN_LOCK_TIME) > now,
          token: tokenMeta,
          votingPowerRaw: dataUpdate[0][0][0]._hex,
          locked: dataUpdate[0][1],
          totalVP,
          eps,
          now,
          roundedTime,
        })
      );
    } catch (error) {
      console.error('Failed to update veNFT ' + tokenId, error);
    }
  };

  return (
    <LockerContext.Provider
      value={{
        status,
        votingPowerStatus,
        data,
        error,
        votingPowerError,
        fetch: fetchData,
        fetchVotingPowerHistory,
        fetchCurrentVotingPower,
        removeVeNFT,
        refreshVeNFTList,
        updateVeNFT,
      }}
    >
      {children}
    </LockerContext.Provider>
  );
}

export const useLockerContext = () => useContext(LockerContext);
