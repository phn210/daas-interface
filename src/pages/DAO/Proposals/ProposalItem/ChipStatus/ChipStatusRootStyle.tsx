import { styled } from '@mui/material/styles';

export const ChipStatusRootStyles = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  width: 'fit-content',
  height: '29px',
  paddingRight: '10px',
  alignItems: 'center',
  justifyContent: 'left',
  borderRadius: '5px',
  textTransform: 'capitalize',

  '& .status_dot': {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    margin: '0px 10px',
  },
  '& .status_text': {
    fontWeight: '400',
    fontSize: '16px',
  },
  '&.chip_active': {
    background: theme.palette.success.light,
    color: theme.palette.success.main,
    '& .status_dot': {
      background: theme.palette.success.main,
    },
  },
  '&.chip_pending': {
    background: theme.palette.warning.light,
    color: theme.palette.warning.main,
    '& .status_dot': {
      background: theme.palette.warning.main,
    },
  },
  '&.chip_queued, &.chip_executed, &.chip_succeeded': {
    background: theme.palette.info.light,
    color: theme.palette.info.main,
    '& .status_dot': {
      background: theme.palette.info.main,
    },
  },
  '&.chip_expired, &.chip_canceled, &.chip_cancelled': {
    background: '#919AA826',
    color: 'rgba(145, 154, 168, 1)',
    '& .status_dot': {
      background: 'rgba(145, 154, 168, 1)',
    },
  },
  '&.chip_defeated': {
    background: theme.palette.error.light,
    color: theme.palette.error.main,
    '& .status_dot': {
      background: theme.palette.error.main,
    },
  },
  [theme.breakpoints.down('xsm')]: {
    '& .status_text': {
      fontSize: '12px',
    },
  },
}));
