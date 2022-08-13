import { styled } from '@mui/material/styles';

export const RangeStickRootStyle = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '405px',
  color: theme.palette.text.secondary,
  marginLeft: 'auto',

  '& .stick_bg': {
    background: theme.palette.mode == 'light' ? 'rgba(230, 235, 244, 1)' : '#293F59',
    borderRadius: '10px',
    height: '10px',
    position: 'relative',

    '& .stick_value': {
      position: 'relative',
      height: '100%',
      borderRadius: '10px',
      display: 'block',
    },
  },

  [theme.breakpoints.down('md')]: {
    maxWidth: 'unset',
  },
}));
