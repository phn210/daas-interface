import { useMemo } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import ProposalItem from './ProposalItem/ProposalItem';
import { useProposalsContext } from 'src/contexts/proposals-context';
import { Proposal } from 'src/contexts/proposals-context/types';
import { useWeb3Context } from 'src/contexts/web3-context';
import { FetchingStatus } from 'src/constants';
import Loading from 'src/components/Loading';
import Failed from 'src/components/Failed';
import { getErrorMessage } from 'src/utils';
import Empty from 'src/components/Empty';

type ProposalListProps = {
  filterState?: number[];
  searchName: string;
};

type Params = {
  daoId: string
}

export default function ProposalList(props: ProposalListProps) {
  const { activating } = useWeb3Context();
  const { status, data, error, fetch } = useProposalsContext();
  const params: Params = useParams();

  const list = useMemo(() => {

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
            <Button variant="contained" color="primary" sx={{ px: 3 }} onClick={() => fetch(String(params.daoId))}>
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
                  return (
                    <RouterLink
                      key={'proposal' + item['_id'] + index}
                      to={`/${params.daoId}/proposals/${item['_id']}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <ProposalItem data={item} />
                    </RouterLink>
                  );
                })}
              </>
            )}
          </>
        )}
      </>
    </Box>
  );
}
