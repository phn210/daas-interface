import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ProposalItemRootStyle = styled(Box)(({ theme }) => ({
  marginTop: '16px',
  padding: '23px 29px 23px 29px',
  borderRadius: '12px',
  '& .title_proposal': {
    fontSize: '24px',
    '& a': {
      position: 'relative',
      '&::before': {
        bottom: 0,
        left: 0,
        position: 'absolute',
        content: '""',
        display: 'block',
        height: '2px',
        width: '0%',
        background: theme.palette.text.secondary,
        transition: '0.2s',
        // transformOrigin: 'center',
      },
    },
    '& a:hover': {
      '&::before': {
        width: '100%',
      },
    },
  },
  '& .status_time': {
    color: theme.palette.text.secondary,
    fontSize: '14px',
    fontWeight: '400',
  },

  [theme.breakpoints.down('xsm')]: {
    padding: '23px 19px',
  },
}));
