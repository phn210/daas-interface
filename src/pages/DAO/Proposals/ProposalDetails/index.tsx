import { useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Reply } from '@mui/icons-material';
import { useDetailProposalContext } from 'src/contexts/detail-proposal-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import ProposalInfor from './ProposalInfor/ProposalInfor';
import YourInfor from './YourInfor/YourInfor';
import VotingResult from './VotingResult/VotingResult';

type ParamsUrl = {
  proposalId: string;
};

export default function ProposalDetails() {
  const params: ParamsUrl = useParams();
  const { data, fetch } = useDetailProposalContext();
  const { address, chain } = useWeb3Context();

  useEffect(() => {
    fetch(params.proposalId);
  }, [address, chain]);
  
  return (
    <>
      <Box sx={{ maxWidth: { xs: '541px', sm: '680px', lg: 'unset' }, margin: '0 auto' }}>
        <Box>
          <RouterLink to={'../proposals'} style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{ bgcolor: 'secondary.dark', color: 'text.primary', ':hover': { bgcolor: 'primary.light' } }}
            >
              <Reply sx={{ mr: 1, width: '21px' }} /> Back
            </Button>
          </RouterLink>
        </Box>

        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} lg={8}>
            <ProposalInfor />
          </Grid>
          <Grid item xs={12} lg={4}>
            <YourInfor proposalId={params.proposalId}/>
            <br />
            <VotingResult />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
