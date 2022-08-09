import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const VoteComponentRootStyle = styled(Box)(({ theme }) => ({
  '.pagination': {
    '& button:not(.Mui-selected)': {
      background: theme.palette.mode == 'dark' ? '#16243B' : '#FFFFFF',
    },
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '541px',
    margin: '0 auto',
  },
}));
