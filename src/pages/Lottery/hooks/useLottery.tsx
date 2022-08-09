import { useEffect, useState } from 'react';
import { FetchingStatus } from 'src/constants';
import { useWeb3Context } from 'src/contexts/web3-context';
import { EthersBigNumber } from 'src/global';
import { useMulticall } from 'src/hooks/multicall';
import { useLotteryContract } from 'src/hooks/useContract';
import { LotteryData, LuckyNumberRangeData } from '../types';

export function useLottery() {
  const [error, setError] = useState<Error | undefined>();
  const [nounce, setNounce] = useState<number>(0);
  const [status, setStatus] = useState<FetchingStatus>(FetchingStatus.IDLE);
  const [data, setData] = useState<LotteryData>({});
  const contract = useLotteryContract();
  const multicall = useMulticall();

  const fetchData = async () => {
    try {
      if (!contract) throw new Error();
      if (status === FetchingStatus.IDLE || status === FetchingStatus.FAILED) {
        setStatus(FetchingStatus.FETCHING);
      } else if (status === FetchingStatus.SUCCESS) {
        setStatus(FetchingStatus.UPDATING);
      }
      const {
        data: [[winners, [luckyNumbers]]],
      } = await multicall.default([
        {
          interface: contract.interface,
          calls: [
            {
              target: contract.address,
              method: contract.interface.getFunction('getWinners'),
            },
            {
              target: contract.address,
              method: contract.interface.getFunction('getLuckyNumber'),
            },
          ],
        },
      ]);
      setData({
        winnerList: winners.flat(),
        luckyNumbers: luckyNumbers.map((n: EthersBigNumber) => n.toNumber()),
      });
      setError(undefined);
      setStatus(FetchingStatus.SUCCESS);
      setNounce(nounce + 1);
    } catch (error) {
      console.debug(error);
      setNounce(nounce + 1);
      setError(error as Error);
      setData({});
      setStatus(FetchingStatus.FAILED);
    }
  };

  useEffect(() => {
    fetchData();
  }, [contract, multicall]);

  useEffect(() => {
    const timer = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(timer);
  }, [contract, multicall, nounce]);

  return {
    status,
    loading: status === FetchingStatus.IDLE || status === FetchingStatus.FETCHING,
    data,
    error,
    fetch: fetchData,
  };
}

export function useUserLuckyNumberRange() {
  const { address } = useWeb3Context();
  const [error, setError] = useState<Error | undefined>();
  const [status, setStatus] = useState<FetchingStatus>(FetchingStatus.IDLE);
  const [data, setData] = useState<LuckyNumberRangeData>({});
  const contract = useLotteryContract();

  const fetchData = async () => {
    try {
      if (!contract || !address) throw new Error();
      if (status === FetchingStatus.IDLE || status === FetchingStatus.FAILED) {
        setStatus(FetchingStatus.FETCHING);
      } else if (status === FetchingStatus.SUCCESS) {
        setStatus(FetchingStatus.UPDATING);
      }
      const id = await contract.userTickets(address);
      const ticket = await contract.tickets(id);
      setData({
        ticket: {
          id: id.toNumber(),
          head: ticket.head.toNumber(),
          tail: ticket.tail.toNumber(),
        },
      });
      setStatus(FetchingStatus.SUCCESS);
    } catch (error) {
      console.debug(error);
      setError(error as Error);
      setData({});
      setStatus(FetchingStatus.FAILED);
    }
  };

  useEffect(() => {
    fetchData();
  }, [contract, address]);

  return {
    status,
    loading: status === FetchingStatus.IDLE || status === FetchingStatus.FETCHING,
    error,
    data,
    fetch: fetchData,
  };
}
