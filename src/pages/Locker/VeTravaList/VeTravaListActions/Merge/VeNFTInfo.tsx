import { Box, Typography } from '@mui/material';
import Moment from 'react-moment';
import { VeNFT } from 'src/contexts/locker-context/types';
import { TravaIcon } from 'src/icons';
import { formatNumber } from 'src/utils/format';
import VeStatus from '../../components/VeStatus';

export default function VeNFTInfo({ data }: { data: VeNFT }) {
  return (
    <Box
      sx={{
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'secondary.dark',
        borderRadius: 2.5,
        bgcolor: 'background.secondary',
      }}
    >
      <Box sx={{ p: 1.5, borderBottomWidth: 1, borderBottomColor: 'secondary.dark', borderBottomStyle: 'solid' }}>
        <Typography align="center" variant="subtitle1">
          veTravaNFT
        </Typography>
      </Box>
      <Box p={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Typography>ID</Typography>
          <Typography>{data.id}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 2 }}>
          <Typography>Status</Typography>
          <VeStatus endTime={data.endTime} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 2 }}>
          <Typography>Voting Power</Typography>
          <Typography variant="subtitle1" color="primary.main">
            {formatNumber(data.votingPower, { fractionDigits: 2 })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 2 }}>
          <Typography>Unlock</Typography>
          <Typography>
            <Moment format="MM/DD/YYYY">{data.endTime}</Moment>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 2 }}>
          <Typography>Balance</Typography>
          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
            {formatNumber(data.balance, { fractionDigits: 2 })}
            &nbsp;
            <TravaIcon color="primary" fontSize="small" />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
