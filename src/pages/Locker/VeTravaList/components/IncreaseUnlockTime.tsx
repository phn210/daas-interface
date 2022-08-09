import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Divider, Typography } from '@mui/material';
import { SyntheticEvent, useMemo, useState } from 'react';
import Moment from 'react-moment';
import BootstrapButton from 'src/components/primitives/BootstrapButton';
import { useLockerContext } from 'src/contexts/locker-context';
import { calcUnlockTime } from 'src/contracts/utils';
import { BigNumberish } from 'src/global';
import { useVeContract } from 'src/hooks/useContract';
import useNotifier from 'src/hooks/useNotifier';
import { BN, handleError } from 'src/utils';
import { formatNumber } from 'src/utils/format';
import { timeLockOptions } from '../../config';
import TimeLockInput, { OptionType } from '../../shared/TimeLockInput';
import VotingPower from '../../shared/VotingPower';
import { Status, useVeStatus } from '../useVeStatus';

interface IncreaseUnLockTimeProps {
  id: number | string;
  endTime: number;
  balance: string;
  claimedReward: string;
  votingPower: string;
  tokenSymbol: string;
  tokenRatio: BigNumberish;
}

export default function IncreaseUnLockTime(props: IncreaseUnLockTimeProps) {
  const { id, endTime, balance, claimedReward, votingPower, tokenSymbol, tokenRatio } = props;
  const { updateVeNFT } = useLockerContext();
  const [timeLock, setTimeLock] = useState<OptionType['key']>(() => timeLockOptions.slice(-1)[0].key);
  const [isIncreasingTime, setIsIncreasingTime] = useState<boolean>(false);
  const [isValidTimeLock, setIsValidTimeLock] = useState<boolean>(true);
  const newUnlockTime = useMemo<number>(() => {
    return calcUnlockTime(Math.floor(new Date().getTime() / 1000), Number(timeLock)) * 1000;
  }, [timeLock, endTime]);
  //
  const amountInTrava = useMemo(() => {
    return BN(balance).times(tokenRatio).plus(claimedReward).toString();
  }, [balance, tokenRatio, claimedReward]);

  const status = useVeStatus(endTime, 60000);
  const { notifyError, notifySuccess } = useNotifier();
  const veContract = useVeContract(true);

  const handleSubmit = async (ev: SyntheticEvent) => {
    ev.preventDefault();
    setIsIncreasingTime(true);
    try {
      if (!veContract) throw new Error('Connection error');
      await (await veContract.increase_unlock_time(id, timeLock)).wait();
      notifySuccess('Change unlock time successfully');
      updateVeNFT(id);
    } catch (error) {
      handleError(error, notifyError);
    }
    setIsIncreasingTime(false);
  };

  const handleTimeLockChange = (newVal: OptionType['key'], isValid: boolean) => {
    setTimeLock(newVal);
    setIsValidTimeLock(isValid);
  };

  return (
    <Box>
      <Typography variant="subtitle1">Change Unlock Time</Typography>
      <Box mt={1}>
        <form onSubmit={handleSubmit} noValidate>
          <TimeLockInput
            id={`time-lock-select-${id}`}
            options={timeLockOptions}
            disableTimeRange
            value={timeLock}
            onChange={handleTimeLockChange}
            minTime={endTime / 1000}
          />

          <Box mt={1}>
            <BootstrapButton
              type="submit"
              size="large"
              color="primary"
              variant="contained"
              fullWidth
              loading={isIncreasingTime}
              disabled={status === Status.RELEASED || isIncreasingTime || !isValidTimeLock}
            >
              Lock Time
            </BootstrapButton>
          </Box>
        </form>
      </Box>

      <Box mt={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography color="secondary.main">Balance</Typography>
          <Typography>
            {formatNumber(balance, { fractionDigits: 2 })}
            &nbsp;
            {tokenSymbol}
          </Typography>
        </Box>

        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography color="secondary.main">Unlock</Typography>
          <Typography>
            <Moment format="MM/DD/YYYY">{newUnlockTime}</Moment>
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography color="secondary.main">Voting Power</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography component="span">{formatNumber(votingPower, { fractionDigits: 2, padZero: true })}</Typography>
            &nbsp;
            <ArrowForwardIcon fontSize="small" />
            &nbsp;
            <Typography component="span" variant="h4" color="primary.main">
              <VotingPower amount={amountInTrava} unlockTime={newUnlockTime} />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
