import { useRef } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { formatAddress } from 'src/utils/format';
import { ProposalItemRootStyle } from './ProposalItemRootStyle';
import ChipStatus from './ChipStatus/ChipStatus';
import RangeStick from './RangeStick/RangeStick';
import { Proposal } from 'src/contexts/proposals-context/types';
import Quorum from './Quorum/Quorum';
import Moment from 'react-moment';

type Props = {
  data: Proposal;
};

type Params = {
  daoId: string;
}

export default function ProposalItem(props: Props) {
  const matches = useMediaQuery('(max-width:1280px)');
  const matches1 = useMediaQuery('(max-width:600px)');
  const linkRef = useRef<HTMLAnchorElement>(null);
  const params: Params = useParams();
  // function clickDb() {
  //   if (null !== linkRef.current) {
  //     linkRef.current.click();
  //   }
  // }
  
  return (
    <ProposalItemRootStyle
      sx={{ bgcolor: 'background.paper' }} 
      // onDoubleClick={clickDb}
    >
      <Grid container rowSpacing={{ xs: 4, sm: 0 }}>
        <Grid item xs={12} md={8}>
          <Typography color="text.primary" className="title_proposal" variant="h4">
            {props.data.title}
          </Typography>
          <Box sx={{ mt: { xs: 2, sm: 3 }, display: 'flex' }}>
            <Box sx={{ display: 'block', width: '68%', flexWrap: 'wrap' }}>
              <Box sx={{ width: matches1 ? '99px' : '137px', mt:1, display: 'flex' }}>
                <Typography component='span' variant='h6'>Proposer:</Typography>&nbsp;
                <Typography component='span' variant='h6' fontStyle='italic'>{formatAddress(props.data.proposer)}</Typography>
              </Box>
              <Box sx={{ width: matches1 ? '99px' : '137px', mt:2 }}>
                <ChipStatus status={props.data.status} />
              </Box>
              {/* <Box
                sx={{
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  ml: 1,
                  width: matches ? '90px' : '235px',
                }}
              >
                <span className="status_time">
                  {matches ? (
                    <Moment format="MMM D, yyyy" date={new Date(Number(props.data.stateTimestamp + '000'))} />
                  ) : (
                    <>
                      <span style={{ textTransform: 'capitalize' }}>{props.data.stateText}</span>
                      {' on '}
                      <Moment format="MMMM Do yyyy" date={new Date(Number(props.data.stateTimestamp + '000'))} />
                    </>
                  )}
                </span>
              </Box> */}
            </Box>

            {/* <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
              <Quorum
                forVotes={props.data.forVotes}
                proposalStatus={props.data.status}
                quorumValue={props.data.quorum}
              />
            </Box> */}
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <RangeStick
            type="For"
            valuePercentage={Number(props.data.forVotesPercentage)}
            valueCount={Number(props.data.forVotes)}
          />
          <RangeStick
            type="Against"
            valuePercentage={Number(props.data.againstVotesPercentage)}
            valueCount={Number(props.data.againstVotes)}
            sx={{ mt: 2.5 }}
          />
          <RangeStick
            type="Abstain"
            valuePercentage={Number(props.data.abstainVotesPercentage)}
            valueCount={Number(props.data.abstainVotes)}
            sx={{ mt: 2.5 }}
          />
        </Grid>
      </Grid>
    </ProposalItemRootStyle>
  );
}
