import { Box, Paper, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { calcUnlockTime } from 'src/contracts/utils';
import useFeedTokenRatio from 'src/hooks/useFeedTokenRatio';
import useTokenLockOptions from 'src/hooks/useTokenLockOptions';
import { BN } from 'src/utils';
import { timeLockOptions } from '../config';
import AmountInput, { InputToken } from '../shared/AmountInput';
import TimeLockInput, { OptionType } from '../shared/TimeLockInput';
import VotingPower from '../shared/VotingPower';

export default function LockerCalculator() {
  const tokenLockOptions = useTokenLockOptions();
  const [amount, setAmount] = useState<number | string>(100);
  const [token, setToken] = useState<InputToken>(Object.keys(tokenLockOptions)[0]);
  const [timeLock, setTimeLock] = useState<OptionType['key']>(timeLockOptions.slice(-1)[0].key);
  const { ratio } = useFeedTokenRatio(token);

  const timeRemaining = useMemo<number>(() => {
    const now = Math.floor(new Date().getTime() / 1000);
    let _timeLock = Number(timeLock);
    if (_timeLock === timeLockOptions[0].key) {
      _timeLock += _timeLock;
    }
    return calcUnlockTime(now, Number(_timeLock)) - now;
  }, [timeLock]);

  const amountInTrava = useMemo<number | string>(() => {
    return BN(amount).times(ratio).toString();
  }, [ratio, amount]);

  useEffect(() => {
    setToken(Object.keys(tokenLockOptions)[0]);
  }, [tokenLockOptions]);

  const handleAmountChange = (newVal: string) => {
    setAmount(newVal);
  };

  const handleTimeLockChange = (newVal: OptionType['key']) => {
    setTimeLock(newVal);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Voting Power Calculator
      </Typography>
      <Paper sx={{ p: 2, flexGrow: 1 }}>
        <Box>
          <AmountInput
            id="lock-amount-inp"
            value={amount}
            token={token}
            onAmountChange={handleAmountChange}
            onTokenChange={(token) => setToken(token)}
          />
        </Box>
        <Box mt={1}>
          <TimeLockInput
            options={timeLockOptions}
            disableTimeRange={false}
            value={timeLock}
            onChange={handleTimeLockChange}
          />
        </Box>
        <Box mt={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography color="secondary.main">Your Voting Power will be</Typography>
            <Typography component="div" variant="h4" color="primary.main">
              <VotingPower amount={amountInTrava} timeRemaining={timeRemaining} />
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
