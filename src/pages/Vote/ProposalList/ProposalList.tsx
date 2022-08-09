import { useMemo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ProposalItem from './ProposalItem/ProposalItem';
import { useVoteContext } from 'src/contexts/vote-context';
import { Proposal } from 'src/contexts/vote-context/types';
import { useWeb3Context } from 'src/contexts/web3-context';
import { FetchingStatus } from 'src/constants';
import Loading from 'src/components/Loading';
import Failed from 'src/components/Failed';
import { getErrorMessage } from 'src/utils';
import Empty from 'src/components/Empty';

type ProposalListProps = {
  filterState: number[];
  searchName: string;
};
export default function ProposalList(props: ProposalListProps) {
  const { activating } = useWeb3Context();
  const { status, data, error, fetch } = useVoteContext();

  const list = useMemo(() => {
    if (props.filterState) {
      const lengthFilterArr = props.filterState.length || 0;
      if (lengthFilterArr != 0) {
        const dataFilter = [];
        const dataProposalList = data?.proposalList ? Object.values(data.proposalList) : [];
        const lengthProposal = dataProposalList.length;
        for (let i = 0; i < lengthProposal; i++) {
          for (let j = 0; j < lengthFilterArr; j++) {
            if (dataProposalList[i].status == props.filterState[j]) {
              dataFilter.push(dataProposalList[i]);
              break;
            }
          }
        }

        if (props.searchName) {
          const dataFilterAndSearch = [];
          const lengthDataFilter = dataFilter.length;
          for (let i = 0; i < lengthDataFilter; i++) {
            if (dataFilter[i].title.toLocaleLowerCase().includes(props.searchName.toLocaleLowerCase())) {
              dataFilterAndSearch.push(dataFilter[i]);
            }
          }
          return dataFilterAndSearch;
        }
        return dataFilter;
      }
    }

    if (props.searchName) {
      const dataSearch = [];
      const dataProposalList = data?.proposalList ? Object.values(data.proposalList) : [];
      const lengthProposal = dataProposalList.length;
      for (let i = 0; i < lengthProposal; i++) {
        if (dataProposalList[i].title.toLocaleLowerCase().includes(props.searchName.toLocaleLowerCase())) {
          dataSearch.push(dataProposalList[i]);
        }
      }
      return dataSearch;
    }

    return data?.proposalList ? Object.values(data.proposalList) : [];
  }, [data?.proposalList, props.filterState, props.searchName]);

  return (
    <Box>
      <>
        {(status === FetchingStatus.IDLE || status === FetchingStatus.FETCHING || activating) && (
          <Box textAlign={'center'} py={4}>
            <Loading size={50} />
            <Typography color="text.secondary">Please wait a moment...</Typography>
          </Box>
        )}
        {status === FetchingStatus.FAILED && (
          <Failed title="Failed to fetch data" detail={getErrorMessage(error)}>
            <Button variant="contained" color="primary" sx={{ px: 3 }} onClick={() => fetch()}>
              Reload
            </Button>
          </Failed>
        )}
        {(status === FetchingStatus.SUCCESS || status === FetchingStatus.UPDATING) && !activating && (
          <>
            {list.length === 0 ? (
              <Empty py={4} />
            ) : (
              <>
                {list.map((item: Proposal, index: number) => {
                  return <ProposalItem key={'proposal' + item.id + index} data={item} />;
                })}
              </>
            )}
          </>
        )}
      </>
    </Box>
  );
}
