import { styled } from '@mui/material/styles';

export const CustomContentStyle = styled('div')(({ theme }) => ({
  '& .content-text': {
    textAlign: 'justify',
    color: theme.palette.text.secondary,
  },
  '& .content-img': {
    width: '100%',
    maxWidth: '750px',
    maxHeight: '550px',
    display: 'block',
    margin: '0 auto',
    objectFit: 'contain',
  },
  '& .content-hyperlink': {
    color: theme.palette.primary.main,
  },
}));
