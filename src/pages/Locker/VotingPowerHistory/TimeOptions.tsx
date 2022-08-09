import { Button, ButtonGroup } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLockerContext } from 'src/contexts/locker-context';
import { useWeb3Context } from 'src/contexts/web3-context';

export default function TimeOptions() {
  const options = [{ text: '1W', days: 7 }, { text: '1M', days: 30 }, { text: '1Y', days: 365 }, { text: 'ALL' }];
  const { address } = useWeb3Context();
  const [active, setActive] = useState<number>(3);
  const { fetchVotingPowerHistory } = useLockerContext();

  useEffect(() => {
    fetchVotingPowerHistory(options[active].days);
  }, [active, address]);

  const getClickHandler = (idx: number) => () => {
    setActive(idx);
  };

  return (
    <ButtonGroup sx={{ bgcolor: 'background.default' }} disableElevation>
      {options.map((item, idx) => (
        <Button
          key={item.text}
          onClick={getClickHandler(idx)}
          variant={active === idx ? 'contained' : 'text'}
          color="primary"
        >
          {item.text}
        </Button>
      ))}
    </ButtonGroup>
  );
}
