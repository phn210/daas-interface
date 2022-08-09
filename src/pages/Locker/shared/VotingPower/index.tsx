/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState } from 'react';
import { calcVotingPower } from 'src/contracts/utils';
import { formatNumber } from 'src/utils/format';

const timeLeft = (t: number | string) => Math.max(new Date(t).getTime() - new Date().getTime(), 0) / 1000;

interface VotingPowerProps {
  amount: number | string;
  timeRemaining?: number | string;
  unlockTime?: number | string;
  refreshDuration?: number;
}

export default function VotingPower({ amount, timeRemaining, unlockTime, refreshDuration }: VotingPowerProps) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [votingPower, setVotingPower] = useState(() => calcVotingPower(amount, timeRemaining ?? timeLeft(unlockTime!)));

  useEffect(() => {
    if (timeRemaining !== undefined) {
      setVotingPower(calcVotingPower(amount, timeRemaining));
      return;
    }
    setVotingPower(calcVotingPower(amount, timeLeft(unlockTime!)));
    const iid = setInterval(() => {
      const l = timeLeft(unlockTime!);
      setVotingPower(calcVotingPower(amount, l));
      if (l === 0 && iid) clearInterval(iid);
    }, refreshDuration);

    return () => clearInterval(iid);
  }, [amount, unlockTime, timeRemaining]);

  return <>{formatNumber(votingPower, { fractionDigits: 2, padZero: true })}</>;
}

VotingPower.defaultProps = {
  refreshDuration: 60000,
};
