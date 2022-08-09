import { Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useVoteContext } from 'src/contexts/vote-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import FilterButton from './FilterButton/FilterButton';
import ProposalList from './ProposalList/ProposalList';
import { VoteComponentRootStyle } from './style';

export default function Vote() {
  const { chain } = useWeb3Context();
  const { fetch } = useVoteContext();
  const [filterState, setFilterState] = useState<number[]>([]);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    fetch();
  }, [chain]);

  return (
    <>
      <VoteComponentRootStyle>
        <Grid className="title_and_search" container rowSpacing={{ xs: 2 }}>
          <Grid item xs={12} sm={6} style={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}>
            Proposals
          </Grid>
          <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'right' }}>
            <TextField
              label="Search"
              size="small"
              style={{ width: '-webkit-fill-available', maxWidth: '348px' }}
              onChange={(e) => {
                setSearchName(e.target.value);
              }}
            />
            <FilterButton filterState={filterState} setFilterState={(list) => setFilterState(list)} />
          </Grid>
        </Grid>
        <ProposalList searchName={searchName} filterState={filterState} />
        {/* <Box style={{ display: 'flex', justifyContent: 'right' }}>
          <Pagination className="pagination" color="primary" page={1} count={1} shape="rounded" />
        </Box> */}
      </VoteComponentRootStyle>
    </>
  );
}
