import LaunchIcon from '@mui/icons-material/Launch';
import { Box, Collapse, Grid, GridProps, Link, Paper, Theme } from '@mui/material';
import { useState } from 'react';
import GridItemSummary from './GridItemSummary';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ClaimReward from '../../components/ClaimReward';
import IncreaseLockBalance from '../../components/IncreaseLockBalance';
import IncreaseUnLockTime from '../../components/IncreaseUnlockTime';
import LockedBalance from '../../components/LockedBalance';
import { VeNFT } from 'src/contexts/locker-context/types';
import { toUSD } from 'src/utils';
import { useTokenPrices } from 'src/contexts/token-price-context';
import ClaimedReward from '../../components/ClaimedReward';
import { useWeb3Context } from 'src/contexts/web3-context';
import { useAppContext } from 'src/contexts/app-context';

interface VeTravaGridListItemProps extends Omit<GridProps, 'container' | 'item'> {
  data: VeNFT;
}

export default function VeTravaGridListItem(props: VeTravaGridListItemProps) {
  const [isShowDetailContent, setIsShowDetailContent] = useState<boolean>(false);
  const { data, ...other } = props;
  const { prices } = useTokenPrices();
  const { getAddressExplorerLink } = useWeb3Context();
  const { contractAddresses } = useAppContext();

  const toggleDetailContent = () => {
    setIsShowDetailContent(!isShowDetailContent);
  };

  return (
    <Grid item {...other}>
      <Paper
        sx={{
          bgcolor: 'background.secondary',
          overflow: 'hidden',
        }}
      >
        <GridItemSummary
          sx={{
            ...(isShowDetailContent
              ? {
                  bgcolor: 'action.selected',
                }
              : {}),
          }}
          id={data.id}
          votingPower={data.votingPower}
          balance={data.balance}
          unlockTime={data.endTime}
          reward={data.reward}
          tokenSymbol={data.tokenSymbol}
        />
        <Collapse in={isShowDetailContent} unmountOnExit>
          <Box p={2}>
            <Box>
              <IncreaseLockBalance
                id={data.id}
                endTime={data.endTime}
                balance={data.balance}
                claimedReward={data.rewardAmount}
                votingPower={data.votingPower}
                token={data.token}
                tokenSymbol={data.tokenSymbol}
                tokenRatio={data.tokenRatio}
              />
            </Box>
            <Box mt={4}>
              <IncreaseUnLockTime
                id={data.id}
                endTime={data.endTime}
                balance={data.balance}
                claimedReward={data.rewardAmount}
                votingPower={data.votingPower}
                tokenSymbol={data.tokenSymbol}
                tokenRatio={data.tokenRatio}
              />
            </Box>
            <Box mt={4}>
              <ClaimReward
                tokenId={data.id}
                rewardAmount={data.claimable}
                rewardAmountUSD={toUSD(data.claimable, prices.trava)}
              />
              <LockedBalance
                mt={1}
                tokenId={data.id}
                endTime={data.endTime}
                lockedBalance={data.amount}
                lockedBalanceUSD={toUSD(data.amount, prices[data.token.toLowerCase()])}
                unclaimedReward={data.claimable}
                tokenSymbol={data.tokenSymbol}
              />
              <ClaimedReward
                mt={1}
                rewardAmount={data.rewardAmount}
                rewardAmountUSD={toUSD(data.rewardAmount, prices.trava)}
              />
              <Box textAlign="right" mt={1}>
                <Link
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  href={getAddressExplorerLink(contractAddresses.VE_TRAVA_ADDRESS)}
                  rel="noreferrer noopener"
                  target="_blank"
                  color="primary"
                >
                  Contract &nbsp;
                  <LaunchIcon fontSize="small" />
                </Link>
              </Box>
            </Box>
          </Box>
        </Collapse>

        <Box
          onClick={toggleDetailContent}
          sx={{
            p: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#002147' : '#EDF5FF'),
          }}
        >
          <KeyboardArrowDownIcon
            fontSize="large"
            sx={{
              transition: '250ms transform linear',
              ...(isShowDetailContent
                ? {
                    transform: 'rotate(180deg)',
                  }
                : {}),
            }}
          />
        </Box>
      </Paper>
    </Grid>
  );
}
