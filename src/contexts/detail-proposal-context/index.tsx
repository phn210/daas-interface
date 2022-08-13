import { createContext, useContext, useState } from 'react';
import { BASE18, FetchingStatus } from 'src/constants';
import { BaseContextProps } from 'src/global';
import { useMulticall } from 'src/hooks/multicall';
import { useApi } from 'src/hooks/useApi';
import { useGovernorContract, useERC20VotesContract, useERC721VotesContract } from 'src/hooks/useContract';
import { BN } from 'src/utils';
import { useCacheContext, useCacheData } from '../cache-context';
import { useWeb3Context } from '../web3-context';
import { ProposalContent, StatusProposal, UserVoteInfor, VotingResultDetail } from './types';

interface DetailProposalContextData {
  statusCallAPI: FetchingStatus;
  statusCallContract: FetchingStatus;
  data: {
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
  const { client } = useApi();

  async function fetchData(proposalId: string) {
    const [_x, currentblock] = await Promise.all([
      getContentProposal(proposalId),
      rpcProvider?.getBlockNumber(),
    ]);
    // if (currentblock && currentblock < Number(startBlock)) {
    //   getUserInforAndVotingResult(proposalId, currentblock.toString());
    // } else {
    //   getUserInforAndVotingResult(proposalId, startBlock);
    // }
  }

  async function getUserInforAndVotingResult(proposalId: string, startBlock: string) {
    try {
      // if (!governorDelegateContract || !votingStrategyContract) {
      //   throw new Error('Connection error');
      // }
      if (statusCallContract === FetchingStatus.IDLE || statusCallContract === FetchingStatus.FAILED) {
        setStatusCallContract(FetchingStatus.FETCHING);
      } else {
        setStatusCallContract(FetchingStatus.UPDATING);
      }

      // const {
      //   data: [[userVotingPower], [[receipt]]],
      // } = address
      //   ? await multicall.default([
      //       {
      //         interface: votingStrategyContract.interface,
      //         calls: [
      //           {
      //             target: votingStrategyContract.address,
      //             method: votingStrategyContract.interface.getFunction('votingPowerForProposal'),
      //             params: [address || '', proposalId, startBlock],
      //           },
      //         ],
      //       },
      //       {
      //         interface: governorDelegateContract.interface,
      //         calls: [
      //           {
      //             target: governorDelegateContract.address,
      //             method: governorDelegateContract.interface.getFunction('getReceipt'),
      //             params: [proposalId, address || ''],
      //           },
      //         ],
      //       },
      //     ])
      //   : { data: [[null], [[null]]] };

      // const { data } = await multicall.default([
      //   {
      //     interface: votingStrategyContract.interface,
      //     calls: [
      //       {
      //         target: votingStrategyContract.address,
      //         method: votingStrategyContract.interface.getFunction('quorum'),
      //         params: [startBlock],
      //       },
      //       {
      //         target: votingStrategyContract.address,
      //         method: votingStrategyContract.interface.getFunction('totalVotingPowerAt'),
      //         params: [startBlock],
      //       },
      //     ],
      //   },
      //   {
      //     interface: governorDelegateContract.interface,
      //     calls: [
      //       {
      //         target: governorDelegateContract.address,
      //         method: governorDelegateContract.interface.getFunction('proposals'),
      //         params: [proposalId],
      //       },
      //       {
      //         target: governorDelegateContract.address,
      //         method: governorDelegateContract.interface.getFunction('state'),
      //         params: [proposalId],
      //       },
      //     ],
      //   },
      // ]);

      // const userVoteInfor: UserVoteInfor = {
      //   votingPower: userVotingPower ? BN(userVotingPower[0]._hex).div(BASE18).toString() : 0,
      //   weight: userVotingPower ? BN(userVotingPower[0]._hex).div(BN(data[0][1][0]._hex)).times(100).toString() : 0,
      //   isVoted: receipt ? Boolean(receipt['hasVoted']) : false,
      //   votedPower: receipt ? (receipt['votes'] ? BN(receipt['votes']._hex).div(BASE18).toString() : 0) : 0,
      //   votedChoice: receipt ? (receipt['support'] == 0 ? 'Against' : 'For') : 'Against',
      //   votedTimestamp: receipt ? receipt['timestamp'] + '000' : 0,
      // } as UserVoteInfor;

      // const totalVotes = BN(data[1][0]['forVotes']._hex).plus(BN(data[1][0]['againstVotes']._hex));

      // const votingResult: VotingResultDetail = {
      //   status: data[1][1][0],
      //   totalVotingPower: BN(data[0][1][0]._hex).div(BASE18).toString(),
      //   totalVote: totalVotes.div(BASE18).toString(),
      //   quorum: BN(data[0][0][0]._hex).div(BASE18).toString(),
      //   startBlock: BN(data[1][0]['startBlock']._hex).toString(),
      //   againstVotes: BN(data[1][0]['againstVotes']._hex).div(BASE18).toString(),
      //   againstVotesPercentage: totalVotes.isEqualTo(BN('0'))
      //     ? '0'
      //     : BN(data[1][0]['againstVotes']._hex).div(totalVotes).times(100).toString(),
      //   forVotes: BN(data[1][0]['forVotes']._hex).div(BASE18).toString(),
      //   forVotesPercentage: totalVotes.isEqualTo(BN('0'))
      //     ? '0'
      //     : BN(data[1][0]['forVotes']._hex).div(totalVotes).times(100).toString(),
      // } as VotingResultDetail;

      // push('detailProposal.userInfor', userVoteInfor);
      // push('detailProposal.votingResult', votingResult);
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
      const response = await client.get('/proposals/details' + proposalId);

      const responseContent = response.data?.proposal_info?.content || {};
      const contentData: ProposalContent = {
        ...responseContent,
        ipfsCid: response.data?.proposal_info?.ipfs_cid || '',
        authors:
          responseContent?.authors?.names?.map((name: string, i: number) => {
            if (responseContent?.authors?.handles) {
              if (responseContent?.authors?.handles[i]) return name + ' (' + responseContent?.authors?.handles[i] + ')';
            }
            return name;
          }) || [],
      };
      push('detailProposal.proposalContent', contentData);

      const responseStatusHistory = response.data?.proposal_info?.states || {};
      const stateHistory: StatusProposal[] = Object.keys(responseStatusHistory).map((key: string | number) => {
        return {
          tx: responseStatusHistory[key].tx || '',
          status: responseStatusHistory[key].state || '',
          timestamp: key + '000',
        };
      });
      push('detailProposal.statusHistory', stateHistory);
      setStatusCallAPI(FetchingStatus.SUCCESS);
      setError(undefined);
    } catch (error) {
      // console.error('Failed to fetch content and history state: ', error);
      setError(error as Error);
      setStatusCallAPI(FetchingStatus.FAILED);
      clear('detailProposal.proposalContent');
      clear('detailProposal.statusHistory');
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
