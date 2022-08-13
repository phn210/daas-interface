import { createContext, useContext, useState } from 'react';
import { BASE18, FetchingStatus } from 'src/constants';
import { BaseContextProps } from 'src/global';
import { useMulticall } from 'src/hooks/multicall';
import { useApi } from 'src/hooks/useApi';
import { useGovernorContract, useERC20VotesContract, useERC721VotesContract } from 'src/hooks/useContract';
import { BN } from 'src/utils';
import { useCacheContext, useCacheData } from '../cache-context';
import { decodeProposalList } from './decode';
import { Proposal } from './types';

interface ProposalsContextData {
	status: FetchingStatus;
	data: {
		proposalList: Proposal[];
	};	
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	error?: any;
	fetch: (daoId: string) => Promise<void>;
}

const ProposalsContext = createContext({} as ProposalsContextData);

export function ProposalsProvider({ children }: BaseContextProps) {
	const [status, setStatus] = useState<FetchingStatus>(FetchingStatus.IDLE);
	const [error, setError] = useState<Error | undefined>();
	const data = useCacheData('proposals', { proposalList: [] });
	const multicall = useMulticall();
	const { push, clear } = useCacheContext();
	const governorContract = useGovernorContract(undefined);
	const erc20VotesContract = useERC20VotesContract(undefined);
	const erc721VotesContract = useERC721VotesContract(undefined);
	const { client } = useApi();

	const fetchData = async (daoId: string) => {
		try {
			if (status === FetchingStatus.IDLE || status === FetchingStatus.FAILED) {
				setStatus(FetchingStatus.FETCHING);
			} else {
				setStatus(FetchingStatus.UPDATING);
			}

			const [dao, proposals] = await Promise.all([
				client.get(`/daos/${daoId}`).then(res => res.data.data as any),
				client.get(`/proposals/${daoId}`).then(res => {
					return res.data.data as any[];
				})
			])
			if (!governorContract || governorContract == null) {
				throw new Error('Connection error');
			}
			const deployedGovernorContract = governorContract.attach(dao.governor);
			const indexes = proposals.map(p => { return p.index; })
			console.log(deployedGovernorContract.address)
			const encodedProposalsInfo = await deployedGovernorContract.proposalsInfo(indexes);
			
			const decodedProposals: Proposal[] = encodedProposalsInfo.map((dataEncoded: Array<string>, i: number) => {
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
				abstainVotes: BN(decodeProposalData.againstVotes).div(BASE18).toString(),
				abstainVotesPercentage: totalVotes.isEqualTo(BN(0))
					? '0'
					: BN(decodeProposalData.againstVotes).div(totalVotes).times(100).toString(),
				
				title: proposals[indexes[i]]?.title,
				// stateTimestamp: normalizedBackendProposals[proposalIndexes[i]]?.state_timestamp,
				// stateText: normalizedBackendProposals[proposalIndexes[i]]?.state,
				// createdAt: normalizedBackendProposals[proposalIndexes[i]]?.created_at,
				} as Proposal;
			});

			const combined = proposals.map((p, index: number) => {return Object.assign(decodedProposals[index], proposals[index])})
			console.log(combined)

			const {
				data: [states],
			} = await multicall.default([
				{
					interface: deployedGovernorContract.interface,
					calls: proposals.map((p) => ({
						target: deployedGovernorContract.address,
						method: deployedGovernorContract.interface.getFunction('state'),
						params: [p.id],
					})),
				}
			]);

			decodedProposals.forEach((p: Proposal, i: number) => {
				p.status = states[i][0];
			});

		// const {
		// 	data: [states, quorums],
		// } = await multicall.default([
		// 	{
		// 	interface: governorDelegateContract.interface,
		// 	calls: proposals.map((p) => ({
		// 		target: governorDelegateContract.address,
		// 		method: governorDelegateContract.interface.getFunction('state'),
		// 		params: [p.id],
		// 	})),
		// 	},
		// 	{
		// 	interface: votingStrategyContract.interface,
		// 	calls: proposals.map((p) => ({
		// 		target: votingStrategyContract.address,
		// 		method: votingStrategyContract.interface.getFunction('quorum'),
		// 		params: [p.startBlock],
		// 	})),
		// 	},
		// ]);
		// // update quorum in each proposal

		// proposals.forEach((p: Proposal, i: number) => {
		// 	p.quorumAttendance = BN(quorums[i][0]._hex).div(BASE18).toString();
		// 	p.status = states[i][0];
		// });
			push('proposals.proposalList', decodedProposals);
			setStatus(FetchingStatus.SUCCESS);
			setError(undefined);
		} catch (error) {
			console.error('Failed to fetch proposals data', error);
			setError(error as Error);
			setStatus(FetchingStatus.FAILED);
			clear('proposals.proposalList');
		}
	};

  return (
    <ProposalsContext.Provider
      value={{
        status,
        data,
        error,
        fetch: fetchData,
      }}
    >
      {children}
    </ProposalsContext.Provider>
  );
}

export const useProposalsContext = () => useContext(ProposalsContext);
