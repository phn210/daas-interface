import { Box, Checkbox, Paper, PaperProps, Tooltip, Typography } from '@mui/material';
import useNotifier from 'src/hooks/useNotifier';
import { TravaIcon } from 'src/icons';
import { isNumeric } from 'src/utils';
import { formatNumber } from 'src/utils/format';
import VeStatus from '../../components/VeStatus';
import { useVeTravaListContext } from '../../context';
import { addSelectedItem, removeSelectedItem } from '../../reducer';

interface ItemSummaryProps extends Omit<PaperProps, 'id'> {
  id: number | string;
  votingPower: string;
  balance: string;
  unlockTime: number;
  reward: string;
  tokenSymbol: string;
}

export default function GridItemSummary(props: ItemSummaryProps) {
  const { dispatch, merge } = useVeTravaListContext();
  const { id, votingPower, balance, unlockTime, reward, tokenSymbol, sx, ...other } = props;
  const { notifyInfo } = useNotifier();

  const handleSelect = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.checked && merge.selectedItemIds.length === merge.max) {
      notifyInfo(`Cannot select more than ${merge.max}`);
      return;
    }
    if (ev.target.checked) {
      dispatch(addSelectedItem({ id }));
    } else {
      dispatch(removeSelectedItem({ id }));
    }
  };

  const contentItemSxProps = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    mb: 1,
  };

  return (
    <Paper sx={{ p: 2, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, ...sx }} {...other}>
      <Checkbox
        sx={{ ml: -1 }}
        inputProps={{ 'aria-label': 've trava checkbox item' }}
        onChange={handleSelect}
        onClick={(ev: React.SyntheticEvent) => ev.stopPropagation()}
        checked={merge.selectedItemIds.includes(id)}
      />
      <Box
        sx={{
          ...contentItemSxProps,
        }}
      >
        <Typography color="text.secondary">ID</Typography>
        <Typography>{id}</Typography>
      </Box>

      <Box sx={contentItemSxProps}>
        <Typography color="text.secondary">Status</Typography>
        <VeStatus endTime={unlockTime} />
      </Box>

      <Box sx={contentItemSxProps}>
        <Typography color="text.secondary">Voting Power</Typography>
        <Typography>{formatNumber(votingPower, { fractionDigits: 2 })}</Typography>
      </Box>

      <Box sx={contentItemSxProps}>
        <Typography color="text.secondary">Balance</Typography>
        <Typography>
          {formatNumber(balance, { fractionDigits: 2 })} {tokenSymbol}
        </Typography>
      </Box>

      <Box sx={contentItemSxProps}>
        <Typography color="text.secondary">Unlock Time</Typography>
        <Typography>
          <Tooltip title={new Date(unlockTime).toLocaleString()} placement="top">
            <span>{isNumeric(unlockTime) ? new Date(unlockTime).toLocaleDateString() : '---'}</span>
          </Tooltip>
        </Typography>
      </Box>

      <Box sx={contentItemSxProps}>
        <Typography color="text.secondary">Reward</Typography>
        <Typography sx={{ display: 'flex', alignItems: 'center' }}>
          <TravaIcon color="primary" />
          &nbsp;
          {formatNumber(reward, { fractionDigits: 2 })}
        </Typography>
      </Box>
    </Paper>
  );
}
