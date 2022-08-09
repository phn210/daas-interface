import HelpIcon from '@mui/icons-material/Help';
import { Box, BoxProps, Tooltip, Typography } from '@mui/material';
import { Fragment, useState } from 'react';
import DialogConfirm from 'src/components/DialogConfirm';
import BootstrapButton from 'src/components/primitives/BootstrapButton';
import { useLockerContext } from 'src/contexts/locker-context';
import { useVeContract } from 'src/hooks/useContract';
import useNotifier from 'src/hooks/useNotifier';
import { BN, handleError } from 'src/utils';
import { formatNumber } from 'src/utils/format';
import { Status, useVeStatus } from '../useVeStatus';

interface ClaimRewardProps extends BoxProps {
  tokenId: string;
  endTime: number;
  lockedBalance?: string;
  lockedBalanceUSD?: string;
  tokenSymbol: string;
  unclaimedReward?: string;
}

export default function LockedBalance(props: ClaimRewardProps) {
  const { tokenId, endTime, lockedBalance, lockedBalanceUSD, tokenSymbol, unclaimedReward, ...other } = props;
  const [isOpenDialogConfirm, setIsOpenDialogConfirm] = useState<boolean>(false);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const status = useVeStatus(endTime, 60000 * 2);
  const veContract = useVeContract(true);
  const { notifyError, notifySuccess } = useNotifier();
  const { removeVeNFT } = useLockerContext();

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      if (!veContract) throw new Error('Connection error');
      await (await veContract.withdraw(tokenId)).wait();
      notifySuccess('Withdraw successfully');
      removeVeNFT(tokenId);
    } catch (error) {
      handleError(error, notifyError);
    }
    setIsWithdrawing(false);
  };

  const handleOpenDialogConfirm = () => {
    if (BN(unclaimedReward).eq(0)) {
      setIsOpenDialogConfirm(false);
      handleWithdraw();
    } else {
      setIsOpenDialogConfirm(true);
    }
  };

  const handleCloseDialogConfirm = () => {
    setIsOpenDialogConfirm(false);
  };

  return (
    <Fragment>
      <Box {...other}>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
          Locked Balance &nbsp;
          <Tooltip
            placement="top"
            title={'Total locked balance in this veTravaNFT, including locked tokens & incentive rewards.'}
          >
            <HelpIcon color="secondary" />
          </Tooltip>
        </Typography>
        <Box sx={{ pt: 1, pb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" color="secondary.light">
              {formatNumber(lockedBalance, { fractionDigits: 2 })} {tokenSymbol}
            </Typography>
            <Typography variant="body3" color="secondary.light">
              ~ {formatNumber(lockedBalanceUSD, { fractionDigits: 4, prefix: '$' })}
            </Typography>
          </Box>
          <Box width={96}>
            <BootstrapButton
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleOpenDialogConfirm}
              loading={isWithdrawing}
              disabled={isWithdrawing || status === Status.LOCKING}
            >
              Withdraw
            </BootstrapButton>
          </Box>
        </Box>
      </Box>
      <DialogConfirm open={isOpenDialogConfirm} onClose={handleCloseDialogConfirm} onOk={handleWithdraw}>
        <Typography gutterBottom color="text.secondary" sx={{ lineHeight: 1.5 }}>
          The unclaimed reward will be lost after withdrawal.
          <br />
          Are you sure you want to do it?
        </Typography>
      </DialogConfirm>
    </Fragment>
  );
}
