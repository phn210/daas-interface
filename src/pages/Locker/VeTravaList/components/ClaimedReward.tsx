import { Box, BoxProps, Typography } from '@mui/material';
import { TravaIcon } from 'src/icons';
import { formatNumber } from 'src/utils/format';

interface ClaimedRewardProps extends BoxProps {
  rewardAmount?: string;
  rewardAmountUSD?: string;
}

export default function ClaimedReward(props: ClaimedRewardProps) {
  const { rewardAmount, rewardAmountUSD, ...other } = props;

  return (
    <Box {...other}>
      <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
        Compounded Rewards
      </Typography>
      <Box sx={{ pt: 1 }}>
        <Typography variant="h5" color="secondary.light" sx={{ display: 'flex', alignItems: 'center' }}>
          <TravaIcon color="primary" />
          &nbsp;
          {formatNumber(rewardAmount, { fractionDigits: 2 })}
        </Typography>
        <Typography variant="body3" color="secondary.light">
          ~ {formatNumber(rewardAmountUSD, { fractionDigits: 4, prefix: '$' })}
        </Typography>
      </Box>
    </Box>
  );
}
