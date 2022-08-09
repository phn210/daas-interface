import { alpha, Box, Typography } from '@mui/material';
import Loading from 'src/components/Loading';
import ConnectButton from 'src/components/WalletButton/ConnectButton';
import { useWeb3Context } from 'src/contexts/web3-context';
import { useUserLuckyNumberRange } from './hooks/useLottery';
import { formatNum } from './utils';

export default function YourLuckyNumberRange() {
  const { address } = useWeb3Context();
  const { loading, data } = useUserLuckyNumberRange();

  if (!address) {
    return (
      <ConnectButton sx={{ backgroundColor: alpha('#1C8CF3', 0.24), color: 'white' }} variant="text" color="inherit" />
    );
  }

  if (loading) {
    return <Loading size={36} />;
  }

  return (
    <Box
      sx={{
        borderRadius: 2,
        backgroundColor: alpha('#1C8CF3', 0.24),
        py: 1.5,
        px: 2.5,
        display: 'inline-block',
        width: 180,
      }}
    >
      <Typography align="center" variant="subtitle1" sx={{ color: 'white' }}>
        {data.ticket ? `${formatNum(data.ticket.head)} - ${formatNum(data.ticket.tail)}` : 'N/A'}
      </Typography>
    </Box>
  );
}
