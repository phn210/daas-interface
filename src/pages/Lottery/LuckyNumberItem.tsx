/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { alpha, Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { formatNum } from './utils';

interface LuckyNumberItemProps {
  luckyNumber?: number;
  open?: boolean;
  duration: number; // in seconds
  range: [number, number];
}

type Timer = ReturnType<typeof setInterval>;
type Timeout = ReturnType<typeof setTimeout>;

export default function LuckyNumberItem(props: LuckyNumberItemProps) {
  const { luckyNumber, open, duration, range } = props;
  const [fakeNum, setFakeNum] = useState<string>('000000');
  const [animating, setAnimating] = useState<boolean>(open ?? false);

  useEffect(() => {
    let timer: Timer | undefined;
    let timeout: Timeout | undefined;

    const clear = () => {
      if (timer) {
        clearInterval(timer);
      }
      if (timeout) {
        clearTimeout(timeout);
      }
    };

    if (!open) {
      clear();
      return;
    }

    if (duration && range) {
      setAnimating(true);

      timer = setInterval(() => {
        const num = (range[0] + Math.random() * (range[1] - range[0])).toFixed(0);
        flushSync(() => setFakeNum(formatNum(num))); // prevent auto batching
      }, 80);

      timeout = setTimeout(() => {
        flushSync(() => {
          setAnimating(false);
          clear();
        });
      }, duration * 1000);
    }

    return () => {
      clear();
    };
  }, [range, open, duration]);

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: '1px solid #FDE58D',
        backgroundColor: alpha('#0BD0FF', 0.21),
        py: 1,
        px: 1,
        display: 'inline-block',
        width: '100%',
      }}
    >
      <Typography align="center" sx={{ color: '#0BD0FF' }} variant="h4">
        {open ? (animating ? fakeNum : formatNum(luckyNumber!)) : '???'}
      </Typography>
    </Box>
  );
}

LuckyNumberItem.defaultProps = {
  duration: 2,
  range: [0, 99999],
};
