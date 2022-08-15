import { createContext, useContext, useState } from 'react';
import { BASE18, FetchingStatus } from 'src/constants';
import { BaseContextProps } from 'src/global';
import { useCacheContext, useCacheData } from 'src/contexts/cache-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import { useMulticall } from 'src/hooks/multicall';
import { useApi } from 'src/hooks/useApi';
import { useGovernorContract, useERC20VotesContract, useERC721VotesContract, useVotesContract } from 'src/hooks/useContract';
import { BN } from 'src/utils';
import { getIpfsHash } from 'src/utils/ipfs';
import { ProposalContent, StatusProposal, UserVoteInfor, VotingResultDetail } from './types';

interface DetailProposalContextData {
	statusCallAPI: FetchingStatus;
	statusCallContract: FetchingStatus;
	data: {
		startBlock: number;
		id: string;
		governor: string;
		proposalContent: ProposalContent;
		userInfor: UserVoteInfor;
		votingResult: VotingResultDetail;
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	error?: any;
	fetch: (proposalId: string) => Promise<void>;
}

const DetailProposalContext = createContext({} as DetailProposalContextData);

export function DetailProposalProvider({ children }: BaseContextProps) {
	const { address, rpcProvider } = useWeb3Context();
	const [statusCallAPI, setStatusCallAPI] = useState<FetchingStatus>(FetchingStatus.IDLE);
	const [statusCallContract, setStatusCallContract] = useState<FetchingStatus>(FetchingStatus.IDLE);
	const [error, setError] = useState<Error | undefined>();
	const data = useCacheData('detailProposal', {});
	const multicall = useMulticall();
	const { push, clear } = useCacheContext();
	const governorContract = useGovernorContract(undefined, true);
	const erc20VotesContract = useERC20VotesContract(undefined, true);
	const erc721VotesContract = useERC721VotesContract(undefined, true);
	const votesContract = useVotesContract(undefined, true);
	const { client, ipfsClient } = useApi();

	async function fetchData(proposalId: string) {
		const [_x, currentblock] = await Promise.all([
			getContentProposal(proposalId),
			rpcProvider?.getBlockNumber(),
		]);
		if (currentblock && currentblock < _x.startBlock) {
			getUserInforAndVotingResult(_x._id, _x.governor, currentblock);
		} else {
			getUserInforAndVotingResult(_x._id, _x.governor, _x.startBlock);
		}
	}

	async function getUserInforAndVotingResult(_id: string, governor: string,startBlock: number) {
		try {
			if (!governorContract || !votesContract) {
				throw new Error('Connection error');
			}
			if (statusCallContract === FetchingStatus.IDLE || statusCallContract === FetchingStatus.FAILED) {
				setStatusCallContract(FetchingStatus.FETCHING);
			} else {
				setStatusCallContract(FetchingStatus.UPDATING);
			}

			const deployedGovernorContract = governor == '' ? governorContract : governorContract.attach(governor);
			const votesAddress = await deployedGovernorContract.votes();
			const deployedVotesContract = votesContract.attach(votesAddress);

			const {
				data: [[userVotingPower, totalVotingPower], [[receipt], [status], proposal]],
			} = address
				? await multicall.default([
					{
						interface: deployedVotesContract.interface,
						calls: [
							{
								target: deployedVotesContract.address,
								method: deployedVotesContract.interface.getFunction('getPastVotes'),
								params: [address || '', startBlock],
							},
							{
								target: deployedVotesContract.address,
								method: deployedVotesContract.interface.getFunction('getPastTotalSupply'),
								params: [startBlock],
							}
						],
					},
					{
						interface: deployedGovernorContract.interface,
						calls: [
							{
								target: deployedGovernorContract.address,
								method: deployedGovernorContract.interface.getFunction('getReceipt'),
								params: [_id, address || ''],
							},
							{
								target: deployedGovernorContract.address,
								method: deployedGovernorContract.interface.getFunction('state'),
								params: [_id],
							},
							{
								target: deployedGovernorContract.address,
								method: deployedGovernorContract.interface.getFunction('proposals'),
								params: [_id],
							}
						],
					}
					
				])
				: { data: [[null, null], [[null], [null], null]] };

			const userVoteInfor: UserVoteInfor = {
				votingPower: userVotingPower ? BN(userVotingPower[0]._hex).div(BASE18).toString() : 0,
				weight: userVotingPower ? BN(userVotingPower[0]._hex).div(BN(totalVotingPower[0]._hex)).times(100).toString() : 0,
				isVoted: receipt ? Boolean(receipt['hasVoted']) : false,
				votedPower: receipt ? (receipt['votes'] ? BN(receipt['votes']._hex).div(BASE18).toString() : 0) : 0,
				votedChoice: receipt ? (receipt['support'] == 0 ? 'Against' : 'For') : 'Against',
				votedTimestamp: receipt ? receipt['timestamp'] + '000' : 0,
			} as UserVoteInfor;

			const totalVotes = BN(proposal['forVotes']._hex).plus(BN(proposal['againstVotes']._hex)).plus(BN(proposal['abstainVotes']._hex));

			const votingResult: VotingResultDetail = {
				// status: 1,
				status: status,
				totalVotingPower: BN(totalVotingPower[0]._hex).div(BASE18).toString(),
				totalVote: totalVotes.div(BASE18).toString(),
				// quorum: BN(data[0][0][0]._hex).div(BASE18).toString(),
				startBlock: BN(proposal['startBlock']._hex).toString(),
				abstainVotes: BN(proposal['abstainVotes']._hex).div(BASE18).toString(),
				abstainVotesPercentage: totalVotes.isEqualTo(BN('0'))
				? '0'
				: BN(proposal['againstVotes']._hex).div(totalVotes).times(100).toString(),
				againstVotes: BN(proposal['againstVotes']._hex).div(BASE18).toString(),
				againstVotesPercentage: totalVotes.isEqualTo(BN('0'))
				? '0'
				: BN(proposal['againstVotes']._hex).div(totalVotes).times(100).toString(),
				forVotes: BN(proposal['forVotes']._hex).div(BASE18).toString(),
				forVotesPercentage: totalVotes.isEqualTo(BN('0'))
				? '0'
				: BN(proposal['forVotes']._hex).div(totalVotes).times(100).toString(),
			} as VotingResultDetail;
			
			push('detailProposal.userInfor', userVoteInfor);
			push('detailProposal.votingResult', votingResult);
			setStatusCallContract(FetchingStatus.SUCCESS);
			setError(undefined);
		} catch (error) {
			console.error('Failed to fetch detail proposal data', error);
			setError(error as Error);
			setStatusCallContract(FetchingStatus.FAILED);
			clear('detailProposal.votingResult');
			clear('detailProposal.userInfor');
		}
	}

	async function getContentProposal(proposalId: string) {
		if (statusCallAPI === FetchingStatus.IDLE || statusCallAPI === FetchingStatus.FAILED) {
			setStatusCallAPI(FetchingStatus.FETCHING);
		} else {
			setStatusCallAPI(FetchingStatus.UPDATING);
		}
		
		try {
			const proposal = (await client.get('/proposals/details/' + proposalId)).data.data;
			const ipfsHash = getIpfsHash(proposal.descriptionHash);
			
			
			const proposalDescription = (await ipfsClient.get(ipfsHash??'QmSLn7MTFjAtPHyZeQ83XKwwB4HGxbF3n82vRefqCz4LDC')).data;
			Object.assign(proposal, proposalDescription);
			console.log(proposal);

			const contentData: ProposalContent = {
				...proposal,
				ipfsCid: ipfsHash || '',
				authors: proposal.authors.names.map((name: string, i: number) => {
					if (proposal.authors.handles && proposal.authors.handles[i])
						return `${name} (${proposal.authors.handles[i]})`;
					else return name;
				}) || [],
			};
			push('detailProposal.startBlock', proposal.startBlock);
			push('detailProposal.id', proposal.id);
			push('detailProposal.governor', proposal.governor);
			push('detailProposal.proposalContent', contentData);
			setStatusCallAPI(FetchingStatus.SUCCESS);
			setError(undefined);
			return {
				startBlock: proposal.startBlock as number,
				governor: proposal.governor as string,
				_id: proposal.id as string
			};
		} catch (error) {
			// console.error('Failed to fetch content and history state: ', error);
			setError(error as Error);
			setStatusCallAPI(FetchingStatus.FAILED);
			clear('detailProposal.proposalContent');
			clear('detailProposal.statusHistory');
			return {
				startBlock: 0,
				governor: '',
				_id: ''
			};
		}
	}

	return (
		<DetailProposalContext.Provider
			value={{
				statusCallAPI,
				statusCallContract,
				data,
				error,
				fetch: (proposalId) => fetchData(proposalId),
			}}
		>
			{children}
		</DetailProposalContext.Provider>
	);
}

export const useDetailProposalContext = () => useContext(DetailProposalContext);
