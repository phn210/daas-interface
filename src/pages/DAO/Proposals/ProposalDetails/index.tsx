import { Box, Button, Grid, Typography } from '@mui/material';
import { Reply } from '@mui/icons-material';
import ProposalInfor from './ProposalInfor/ProposalInfor';
import YourInfor from './YourInfor/YourInfor';
import VotingResult from './VotingResult/VotingResult';
import ProposalHistory from './ProposalHistory/ProposalHistory';
import { NavLink, useParams } from 'react-router-dom';
import FetchData from './FetchData';

type ParamsUrl = {
  idProposal: string;
};

export default function ProposalDetails() {
  const params: ParamsUrl = useParams();

  // const [idProposal, startBlock] = params.idProposal.split('&');
  const [idProposal, startBlock] = ['', '0'];
  return (
    <>
      <FetchData idProposal={idProposal} startBlock={startBlock} />
      <Box sx={{ maxWidth: { xs: '541px', sm: '680px', lg: 'unset' }, margin: '0 auto' }}>
        <Box>
          <NavLink to={'../proposals'} style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{ bgcolor: 'secondary.dark', color: 'text.primary', ':hover': { bgcolor: 'primary.light' } }}
            >
              <Reply sx={{ mr: 1, width: '21px' }} /> Back
            </Button>
          </NavLink>
        </Box>

        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} lg={8}>
            <ProposalInfor />
          </Grid>
          <Grid item xs={12} lg={4}>
            <YourInfor idProposal={idProposal} startBlock={startBlock} />
            <br />
            <VotingResult />
            <br />
            <ProposalHistory />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
