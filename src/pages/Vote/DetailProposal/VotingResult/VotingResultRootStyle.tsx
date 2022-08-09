import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const VotingResultRootStyle = styled(Box)(({ theme }) => ({
  '& .status_voting_result': {
    display: 'flex',
    alignItems: 'center',
    textTransform: 'capitalize',

    '& .status_dot': {
      marginRight: '5px',
      display: 'block',
      width: '7px',
      height: '7px',
      borderRadius: '50%',
    },

    '&.active': {
      color: theme.palette.success.main,
      '& .status_dot': {
        background: theme.palette.success.main,
      },
    },
    '&.executed, &.queued, &.succeeded': {
      color: theme.palette.info.main,
      '& .status_dot': {
        background: theme.palette.info.main,
      },
    },
    '&.defeated': {
      color: theme.palette.error.main,
      '& .status_dot': {
        background: theme.palette.error.main,
      },
    },
    '&.pending': {
      color: theme.palette.warning.main,
      '& .status_dot': {
        background: theme.palette.warning.main,
      },
    },
    '&.expired, &.canceled, &.cancelled': {
      color: 'rgba(145, 154, 168, 1)',
      '& .status_dot': {
        background: 'rgba(145, 154, 168, 1)',
      },
    },
  },

  '.flex_justify_between': {
    display: 'flex',
    justifyContent: 'space-between',
  },
  '& .process': {
    maxWidth: '150px',
    height: '6px',
    background: theme.palette.info.light,
    flexGrow: '1',
    marginLeft: '8px',
    position: 'relative',
    borderRadius: '10px',
    '& .process_value': {
      position: 'relative',
      top: 0,
      left: 0,
      display: 'block',
      height: '100%',
      //   width: '50%',
      background: theme.palette.primary.main,
      borderRadius: '10px',
    },
  },
}));
