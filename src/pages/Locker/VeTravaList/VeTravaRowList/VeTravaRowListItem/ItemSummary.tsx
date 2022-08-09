import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccordionSummary, AccordionSummaryProps, Box, Checkbox, Tooltip, Typography } from '@mui/material';
import { SyntheticEvent } from 'react';
import useNotifier from 'src/hooks/useNotifier';
import { TravaIcon } from 'src/icons';
import { isNumeric } from 'src/utils';
import { formatNumber } from 'src/utils/format';
import VeStatus from '../../components/VeStatus';
import { useVeTravaListContext } from '../../context';
import { addSelectedItem, removeSelectedItem } from '../../reducer';

interface ItemSummaryProps extends Omit<AccordionSummaryProps, 'id' | 'sx'> {
  id: number | string;
  votingPower: string;
  balance: string;
  unlockTime: number;
  reward: string;
  tokenSymbol: string;
}

export default function ItemSummary(props: ItemSummaryProps) {
  const { dispatch, merge } = useVeTravaListContext();
  const { id, votingPower, balance, unlockTime, reward, tokenSymbol, ...other } = props;
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
    flexBasis: 100,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  return (
    <AccordionSummary id={String(id)} {...other} sx={{ pl: 1.5 }} expandIcon={<ExpandMoreIcon fontSize="large" />}>
      <Box sx={{ width: 60, display: 'flex', alignItems: 'center' }}>
        <Checkbox
          inputProps={{ 'aria-label': 've trava checkbox item' }}
          onChange={handleSelect}
          onClick={(ev: SyntheticEvent) => ev.stopPropagation()}
          checked={merge.selectedItemIds.includes(id)}
        />
      </Box>

      <Box
        sx={{
          ...contentItemSxProps,
          flexGrow: 0,
          minWidth: 60,
          width: '12%',
        }}
      >
        <Typography variant="body3" color="text.secondary" gutterBottom>
          ID
        </Typography>
        <Typography variant="body1">{id}</Typography>
      </Box>

      <Box sx={contentItemSxProps}>
        <Typography variant="body3" color="text.secondary" gutterBottom>
          Status
        </Typography>
        <VeStatus endTime={unlockTime} />
      </Box>

      <Box sx={contentItemSxProps}>
        <Typography variant="body3" color="text.secondary" gutterBottom>
          Voting Power
        </Typography>
        <Typography variant="body1">{formatNumber(votingPower, { fractionDigits: 2 })}</Typography>
      </Box>

      <Box sx={contentItemSxProps}>
        <Typography variant="body3" color="text.secondary" gutterBottom>
          Balance
        </Typography>
        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <TravaIcon color="primary" /> */}
          {/* &nbsp; */}
          {formatNumber(balance, { fractionDigits: 2 })} {tokenSymbol}
        </Typography>
      </Box>

      <Box sx={contentItemSxProps}>
        <Typography variant="body3" color="text.secondary" gutterBottom>
          Unlock Time
        </Typography>
        <Typography variant="body1" display="inline">
          <Tooltip title={new Date(unlockTime).toLocaleString()} placement="top">
            <span>{isNumeric(unlockTime) ? new Date(unlockTime).toLocaleDateString() : '---'}</span>
          </Tooltip>
        </Typography>
      </Box>

      <Box sx={contentItemSxProps}>
        <Typography variant="body3" color="text.secondary" gutterBottom>
          Reward
        </Typography>
        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
          <TravaIcon color="primary" />
          &nbsp;
          {formatNumber(reward, { fractionDigits: 2 })}
        </Typography>
      </Box>
    </AccordionSummary>
  );
}
