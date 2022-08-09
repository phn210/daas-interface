import LaunchIcon from '@mui/icons-material/Launch';
import { Accordion, AccordionDetails, Box, Link } from '@mui/material';
import { useAppContext } from 'src/contexts/app-context';
import { VeNFT } from 'src/contexts/locker-context/types';
import { useTokenPrices } from 'src/contexts/token-price-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import { toUSD } from 'src/utils';
import ClaimedReward from '../../components/ClaimedReward';
import ClaimReward from '../../components/ClaimReward';
import IncreaseLockBalance from '../../components/IncreaseLockBalance';
import IncreaseUnLockTime from '../../components/IncreaseUnlockTime';
import LockedBalance from '../../components/LockedBalance';
import ItemSummary from './ItemSummary';

interface VeTravaRowListItemProps {
  data: VeNFT;
}

export default function VeTravaRowListItem(props: VeTravaRowListItemProps) {
  const { data } = props;
  const { prices } = useTokenPrices();
  const { getAddressExplorerLink } = useWeb3Context();
  const { contractAddresses } = useAppContext();

  return (
    <Accordion sx={{ mb: 2 }} TransitionProps={{ unmountOnExit: true }}>
      <ItemSummary
        id={data.id}
        votingPower={data.votingPower}
        balance={data.balance}
        unlockTime={data.endTime}
        reward={data.reward}
        tokenSymbol={data.tokenSymbol}
      />
      <AccordionDetails sx={{ display: 'flex', justifyContent: 'space-between', pb: 2 }}>
        <Box sx={{ flexBasis: '34%' }}>
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
        <Box sx={{ flexBasis: '34%' }}>
          <IncreaseUnLockTime
            id={data.id}
            endTime={data.endTime}
            balance={data.balance}
            claimedReward={data.rewardAmount}
            votingPower={data.votingPower}
            tokenRatio={data.tokenRatio}
            tokenSymbol={data.tokenSymbol}
          />
        </Box>
        <Box sx={{ flexBasis: '23%' }}>
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
      </AccordionDetails>
    </Accordion>
  );
}
