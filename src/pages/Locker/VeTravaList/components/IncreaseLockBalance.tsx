import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Divider, Typography } from '@mui/material';
import { SyntheticEvent, useMemo, useState } from 'react';
import Moment from 'react-moment';
import BootstrapButton from 'src/components/primitives/BootstrapButton';
import { useLockerContext } from 'src/contexts/locker-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import { BigNumberish } from 'src/global';
import { useTokenBalances } from 'src/hooks/useBalances';
import { useVeContract } from 'src/hooks/useContract';
import useHelperFunctions from 'src/hooks/useHelperFunctions';
import useNotifier from 'src/hooks/useNotifier';
import useTokenLockOptions from 'src/hooks/useTokenLockOptions';
import { BN, handleError } from 'src/utils';
import { formatNumber } from 'src/utils/format';
import AmountInput from '../../shared/AmountInput';
import VotingPower from '../../shared/VotingPower';
import { Status, useVeStatus } from '../useVeStatus';

interface IncreaseLockBalanceProps {
  id: number | string;
  endTime: number;
  balance: string;
  claimedReward: string;
  votingPower: string;
  token: string;
  tokenSymbol: string;
  tokenRatio: BigNumberish;
}

export default function IncreaseLockBalance(props: IncreaseLockBalanceProps) {
  const { id, endTime, balance, claimedReward, votingPower, token, tokenSymbol, tokenRatio } = props;
  const tokenLockOptions = useTokenLockOptions();

  const [amount, setAmount] = useState<number | string>(0);
  const [isValidAmount, setIsValidAmount] = useState<boolean>(true);
  const [isLocking, setIsLocking] = useState<boolean>(false);
  const newBalance = useMemo(() => {
    return BN(amount).plus(balance).toString();
  }, [amount, balance]);
  //
  const amountInTrava = useMemo(() => {
    return BN(amount).plus(balance).times(tokenRatio).plus(claimedReward).toString();
  }, [amount, balance, tokenRatio, claimedReward]);

  const status = useVeStatus(endTime, 60000);
  const { address } = useWeb3Context();
  const {
    balances: tokenBalances,
    loading: balanceLoading,
    refresh: refreshBalances,
  } = useTokenBalances(
    address,
    useMemo(() => Object.keys(tokenLockOptions), [tokenLockOptions])
  );
  const { notifyError, notifySuccess } = useNotifier();
  const { handleTokenApprove, getToken } = useHelperFunctions();
  const { updateVeNFT } = useLockerContext();
  const veContract = useVeContract(true);

  const getMaxAmount = () => {
    return tokenBalances[token.toLowerCase()] ?? 0;
  };

  const handleSubmit = async (ev: SyntheticEvent) => {
    ev.preventDefault();
    setIsLocking(true);
    try {
      if (!veContract) throw new Error('Connection error');
      const tokenMeta = await getToken(token);
      await handleTokenApprove(token, veContract.address as string, amount, 1e9);
      const _amount = BN(amount).times(BN(10).pow(tokenMeta.decimals)).toFixed(0);
      await (await veContract.increase_amount(id, _amount)).wait();
      notifySuccess('Increase lock balance successfully');
      updateVeNFT(id);
    } catch (error) {
      handleError(error, notifyError);
    } finally {
      refreshBalances();
    }
    setIsLocking(false);
  };

  const handleAmountChange = (newVal: string, isValid: boolean) => {
    setAmount(newVal);
    setIsValidAmount(isValid);
  };

  return (
    <Box>
      <Typography variant="subtitle1">Increase Lock Balance</Typography>
      <Box mt={1}>
        <form onSubmit={handleSubmit} noValidate>
          <AmountInput
            id={`lock-amount-inp-${id}`}
            value={amount}
            max={getMaxAmount()}
            token={token.toLowerCase()}
            fixedToken
            onAmountChange={handleAmountChange}
            enableMaxAmount
          />

          <Box mt={1}>
            <BootstrapButton
              type="submit"
              size="large"
              color="primary"
              variant="contained"
              fullWidth
              loading={isLocking}
              disabled={status === Status.RELEASED || !isValidAmount || isLocking || balanceLoading}
            >
              Lock Balance
            </BootstrapButton>
          </Box>
        </form>
      </Box>

      <Box mt={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography color="secondary.main">Balance</Typography>
          <Typography>
            {formatNumber(newBalance, { fractionDigits: 2 })}
            &nbsp;
            {tokenSymbol}
          </Typography>
        </Box>

        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography color="secondary.main">Unlock</Typography>
          <Typography>
            <Moment format="MM/DD/YYYY">{endTime}</Moment>
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
              <VotingPower amount={amountInTrava} unlockTime={endTime} />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
