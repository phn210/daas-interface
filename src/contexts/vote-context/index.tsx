import { createContext, useContext, useState } from 'react';
import { BASE18, FetchingStatus } from 'src/constants';
import { BaseContextProps } from 'src/global';
import { useMulticall } from 'src/hooks/multicall';
import { useApi } from 'src/hooks/useApi';
import { useGovernorDelegateContract, useVotingStrategyContract } from 'src/hooks/useContract';
import { BN } from 'src/utils';
import { useCacheContext, useCacheData } from '../cache-context';
import { decodeProposalList } from './decode';
import { Proposal } from './types';

interface VoteContextData {
  status: FetchingStatus;
  data: {
    proposalList: Proposal[];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  fetch: () => Promise<void>;
}

const VoteContext = createContext({} as VoteContextData);

export function VoteProvider({ children }: BaseContextProps) {
  const [status, setStatus] = useState<FetchingStatus>(FetchingStatus.IDLE);
  const [error, setError] = useState<Error | undefined>();
  const data = useCacheData('vote', { proposalList: [] });
  const multicall = useMulticall();
  const { push, clear } = useCacheContext();
  const governorDelegateContract = useGovernorDelegateContract();
  const votingStrategyContract = useVotingStrategyContract();
  const { dashboardClient } = useApi();

  const fetchData = async () => {
    try {
      if (!governorDelegateContract || !votingStrategyContract) {
        throw new Error('Connection error');
      }
      if (status === FetchingStatus.IDLE || status === FetchingStatus.FAILED) {
        setStatus(FetchingStatus.FETCHING);
      } else {
        setStatus(FetchingStatus.UPDATING);
      }

      // n - total proposals
      const [n, backendProposals] = await Promise.all([
        governorDelegateContract.proposalCount(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dashboardClient.get('/proposals').then((res) => res.data.proposals as Array<any>),
      ]);
      const proposalIndexes = new Array(n.toNumber())
        .fill(0)
        .map((_, idx) => idx)
        .reverse();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalizedBackendProposals = backendProposals.reduce<{ [index: string]: any }>((acc, p) => {
        acc[p.index] = p;
        return acc;
      }, {});
      const encodedProposalsInfo = await governorDelegateContract.proposalsInfo(proposalIndexes);

      // decode and normalize
      const proposals: Proposal[] = encodedProposalsInfo.map((dataEncoded: Array<string>, i: number) => {
        const decodeProposalData = decodeProposalList(dataEncoded);
        const totalVotes = BN(decodeProposalData.forVotes).plus(BN(decodeProposalData.againstVotes));
        return {
          ...decodeProposalData,

          forVotes: BN(decodeProposalData.forVotes).div(BASE18).toString(),
          forVotesPercentage: totalVotes.isEqualTo(BN(0))
            ? '0'
            : BN(decodeProposalData.forVotes).div(totalVotes).times(100).toString(),
          againstVotes: BN(decodeProposalData.againstVotes).div(BASE18).toString(),
          againstVotesPercentage: totalVotes.isEqualTo(BN(0))
            ? '0'
            : BN(decodeProposalData.againstVotes).div(totalVotes).times(100).toString(),
          title: normalizedBackendProposals[proposalIndexes[i]]?.title,
          stateTimestamp: normalizedBackendProposals[proposalIndexes[i]]?.state_timestamp,
          stateText: normalizedBackendProposals[proposalIndexes[i]]?.state,
          createdAt: normalizedBackendProposals[proposalIndexes[i]]?.created_at,
        } as Proposal;
      });
      // fetch quorum of all proposals

      const {
        data: [states, quorums],
      } = await multicall.default([
        {
          interface: governorDelegateContract.interface,
          calls: proposals.map((p) => ({
            target: governorDelegateContract.address,
            method: governorDelegateContract.interface.getFunction('state'),
            params: [p.id],
          })),
        },
        {
          interface: votingStrategyContract.interface,
          calls: proposals.map((p) => ({
            target: votingStrategyContract.address,
            method: votingStrategyContract.interface.getFunction('quorum'),
            params: [p.startBlock],
          })),
        },
      ]);
      // update quorum in each proposal

      proposals.forEach((p: Proposal, i: number) => {
        p.quorum = BN(quorums[i][0]._hex).div(BASE18).toString();
        p.status = states[i][0];
      });
      push('vote.proposalList', proposals);
      setStatus(FetchingStatus.SUCCESS);
      setError(undefined);
    } catch (error) {
      console.error('Failed to fetch vote data', error);
      setError(error as Error);
      setStatus(FetchingStatus.FAILED);
      clear('vote.proposalList');
    }
  };

  return (
    <VoteContext.Provider
      value={{
        status,
        data,
        error,
        fetch: fetchData,
      }}
    >
      {children}
    </VoteContext.Provider>
  );
}

export const useVoteContext = () => useContext(VoteContext);
