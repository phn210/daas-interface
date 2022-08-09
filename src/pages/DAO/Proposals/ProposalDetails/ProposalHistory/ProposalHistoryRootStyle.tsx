import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ProposalHistoryRootStyle = styled(Box)(({ theme }) => ({
  '& .timeline': {
    '& .timeline_item': {
      marginTop: '22px',
      display: 'flex',
      alignItems: 'center',

      '& .timline_item_icon, & .timline_item_content': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      '& .timline_item_icon': {
        width: '52px',
        position: 'relative',
      },
      '&:not(:first-of-type) .timline_item_icon': {
        '&::before': {
          position: 'absolute',
          content: '""',
          display: 'block',
          height: '25px',
          width: '1px',
          top: '-26px',
          left: '16px',
          background: theme.palette.primary.main,
        },
      },
      '& .timline_item_content': {
        width: 'calc(100% - 52px)',
      },
    },
  },
}));
