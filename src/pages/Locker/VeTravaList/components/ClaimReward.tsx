import HelpIcon from '@mui/icons-material/Help';
import { Box, BoxProps, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import BootstrapButton from 'src/components/primitives/BootstrapButton';
import { useLockerContext } from 'src/contexts/locker-context';
import { useIncentiveContract } from 'src/hooks/useContract';
import useNotifier from 'src/hooks/useNotifier';
import { TravaIcon } from 'src/icons';
import { BN, handleError } from 'src/utils';
import { formatNumber } from 'src/utils/format';

interface ClaimRewardProps extends BoxProps {
  tokenId: string;
  rewardAmount?: string;
  rewardAmountUSD?: string;
}

export default function ClaimReward(props: ClaimRewardProps) {
  const { tokenId, rewardAmount, rewardAmountUSD, ...other } = props;
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const { notifyError, notifySuccess } = useNotifier();
  const { updateVeNFT } = useLockerContext();
  const incentiveContract = useIncentiveContract(true);

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      if (!incentiveContract) throw new Error('Connection error');
      await (await incentiveContract.claim(tokenId)).wait();
      notifySuccess('Claim successfully');
      updateVeNFT(tokenId);
    } catch (error) {
      handleError(error, notifyError);
    }
    setIsClaiming(false);
  };

  return (
    <Box {...other}>
      <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
        Compoundable Rewards &nbsp;
        <Tooltip placement="top" title={'veTrava holders get rewards in TRAVA, which are emitted per week.'}>
          <HelpIcon color="secondary" />
        </Tooltip>
      </Typography>
      <Box sx={{ pt: 1, pb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" color="secondary.light" sx={{ display: 'flex', alignItems: 'center' }}>
            <TravaIcon color="primary" />
            &nbsp;
            {formatNumber(rewardAmount, { fractionDigits: 2 })}
          </Typography>
          <Typography variant="body3" color="secondary.light">
            ~ {formatNumber(rewardAmountUSD, { fractionDigits: 4, prefix: '$' })}
          </Typography>
        </Box>
        <Box width={96}>
          <BootstrapButton
            fullWidth
            variant="outlined"
            color="primary"
            onClick={handleClaim}
            loading={isClaiming}
            disabled={isClaiming || BN(rewardAmount).eq(0)}
          >
            Compound
          </BootstrapButton>
        </Box>
      </Box>
    </Box>
  );
}
