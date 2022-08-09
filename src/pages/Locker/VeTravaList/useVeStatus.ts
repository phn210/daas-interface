import { useEffect, useState } from 'react';

export enum Status {
  LOCKING = 'Locked',
  RELEASED = 'Released',
}

const isEnded = (time: number) => time < new Date().getTime();

export function useVeStatus(endTime: number, refreshDuration: number) {
  const [status, setStatus] = useState<Status>(() => (isEnded(endTime) ? Status.RELEASED : Status.LOCKING));

  useEffect(() => {
    const iid = setInterval(() => {
      const ended = isEnded(endTime);
      setStatus(ended ? Status.RELEASED : Status.LOCKING);
      if (ended && iid) clearInterval(iid);
    }, refreshDuration);
    return () => clearInterval(iid);
  }, [endTime, refreshDuration]);

  return status;
}
