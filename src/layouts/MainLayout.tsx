import { Box, Hidden, styled } from '@mui/material';
import { Fragment } from 'react';
import BottomBar from './components/BottomBar';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

interface Props {
  children: React.ReactElement;
}

const MainContentWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(3, 1, 9, 1),
  marginLeft: 0,
  height: '100%',
  transition: 'margin-left 300ms ease',

  [theme.breakpoints.up('xsm')]: {
    marginLeft: 80,
    padding: theme.spacing(5, 4, 4, 4),
  },
  [theme.breakpoints.up('md')]: {
    marginLeft: 220,
    padding: theme.spacing(5, 2, 4, 2),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(5, 4, 4, 4),
  },
}));

export default function MainLayout(props: Props) {
  const { children } = props;
  return (
    <Fragment>
      <Header />
      <Box component="main" sx={{ pt: { xsm: 7 }, minHeight: { xs: 'calc(100vh - 55)', xsm: '100vh' } }}>
        <Hidden xsmDown implementation="css">
          <Sidebar />
        </Hidden>
        <MainContentWrapper>{children}</MainContentWrapper>
        <Hidden xsmUp implementation="css">
          <BottomBar />
        </Hidden>
      </Box>
    </Fragment>
  );
}
