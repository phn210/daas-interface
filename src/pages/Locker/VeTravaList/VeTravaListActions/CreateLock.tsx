import { Box, Dialog, DialogContent, Divider, Typography } from '@mui/material';
import { Fragment, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import BootstrapButton, { BootstrapButtonProps } from 'src/components/primitives/BootstrapButton';
import BootstrapDialogTitle from 'src/components/primitives/BootstrapDialogTitle';
import { useLockerContext } from 'src/contexts/locker-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import { calcUnlockTime } from 'src/contracts/utils';
import { useTokenBalances } from 'src/hooks/useBalances';
import { useVeContract } from 'src/hooks/useContract';
import useFeedTokenRatio from 'src/hooks/useFeedTokenRatio';
import useHelperFunctions from 'src/hooks/useHelperFunctions';
import useNotifier from 'src/hooks/useNotifier';
import useTokenLockOptions from 'src/hooks/useTokenLockOptions';
import { AddCircleIcon } from 'src/icons';
import { BN, handleError } from 'src/utils';
import { formatNumber } from 'src/utils/format';
import { timeLockOptions } from '../../config';
import AmountInput, { InputToken } from '../../shared/AmountInput';
import TimeLockInput, { OptionType } from '../../shared/TimeLockInput';
import VotingPower from '../../shared/VotingPower';

export default function CreateLock(props: BootstrapButtonProps) {
  const tokenLockOptions = useTokenLockOptions();
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [amount, setAmount] = useState<number | string>(0);
  const [isValidAmount, setIsValidAmount] = useState<boolean>(true);
  const [token, setToken] = useState<InputToken>(Object.keys(tokenLockOptions)[0]);
  const [timeLock, setTimeLock] = useState<OptionType['key']>(timeLockOptions.slice(-1)[0].key);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const { ratio } = useFeedTokenRatio(token);

  const timeRemaining = useMemo(() => {
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

  const { fetch: refreshLockerData } = useLockerContext();
  const { address } = useWeb3Context();
  const {
    balances,
    loading: balanceLoading,
    refresh: refreshBalances,
  } = useTokenBalances(
    address,
    useMemo(() => Object.keys(tokenLockOptions), [tokenLockOptions])
  );
  const { notifyError, notifySuccess } = useNotifier();
  const { handleTokenApprove, getToken } = useHelperFunctions();
  const veContract = useVeContract(true);

  const getMaxAmount = () => {
    return balances[token] ?? 0;
  };

  const handleAmountChange = (newVal: string, isValid: boolean) => {
    setAmount(newVal);
    setIsValidAmount(isValid);
  };

  const handleTimeLockChange = (newVal: OptionType['key']) => {
    setTimeLock(newVal);
  };

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const handleSubmit = async (ev: SyntheticEvent) => {
    ev.preventDefault();
    setIsCreating(true);
    try {
      if (!veContract) throw new Error('Connection error');
      const tokenMeta = await getToken(token);
      await handleTokenApprove(token, veContract.address as string, amount, 1e9);
      const _amount = BN(amount).times(BN(10).pow(tokenMeta.decimals)).toFixed(0);
      const tx = await veContract.create_lock(token, _amount, timeLock);
      await tx.wait();
      notifySuccess('Create successfully');
      setIsOpenDialog(false);
      refreshLockerData();
    } catch (error) {
      handleError(error, notifyError);
    } finally {
      refreshBalances();
    }
    setIsCreating(false);
  };

  return (
    <Fragment>
      <BootstrapButton
        {...props}
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={handleOpenDialog}
        disabled={isCreating || !address}
      >
        Create Lock
      </BootstrapButton>
      <Dialog open={isOpenDialog} maxWidth="xs" fullWidth aria-labelledby="create-lock-dialog-title">
        <BootstrapDialogTitle id="create-lock-dialog-title" onClose={handleCloseDialog}>
          <Typography color="primary" variant="h4">
            New Lock
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} noValidate>
            <Box>
              <Typography variant="body3">
                Wallet balance: <b>{formatNumber(balances[token], { fallback: 'N/A' })}</b>{' '}
                {tokenLockOptions[token]?.symbol?.toUpperCase()}
              </Typography>
              <AmountInput
                id="dialog-lock-amount-inp"
                value={amount}
                max={getMaxAmount()}
                min={0}
                token={token}
                onAmountChange={handleAmountChange}
                onTokenChange={(token) => setToken(token)}
                enableMaxAmount
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

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography color="secondary.main">Your Voting Power</Typography>
              <Typography variant="subtitle1" color="primary.main">
                <VotingPower amount={amountInTrava} timeRemaining={timeRemaining} />
              </Typography>
            </Box>

            <Box mt={3}>
              <BootstrapButton
                type="submit"
                size="large"
                color="primary"
                variant="contained"
                fullWidth
                loading={isCreating}
                disabled={isCreating || !isValidAmount || balanceLoading}
              >
                Create Lock
              </BootstrapButton>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
