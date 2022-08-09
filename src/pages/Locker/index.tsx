import { Box, Grid } from '@mui/material';
import { useEffect } from 'react';
import { useLockerContext } from 'src/contexts/locker-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import LockerCalculator from './LockerCalculator';
import VeTravaList from './VeTravaList';
import VotingPowerHistory from './VotingPowerHistory';

export default function Locker() {
  const { fetch, refreshVeNFTList } = useLockerContext();
  const { chain, address } = useWeb3Context();

  useEffect(() => {
    fetch(true);
  }, [chain, address]);

  useEffect(() => {
    if (!address) return;
    const timer = setInterval(() => {
      refreshVeNFTList();
    }, 30000);
    return () => clearInterval(timer);
  }, [chain, address]);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <LockerCalculator />
        </Grid>
        <Grid item xs={12} md={7}>
          <VotingPowerHistory />
        </Grid>
        <Grid item xs={12}>
          <VeTravaList />
        </Grid>
      </Grid>
    </Box>
  );
}
