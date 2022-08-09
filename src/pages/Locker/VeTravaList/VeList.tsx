import { Box, Theme, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import Empty from 'src/components/Empty';
import { useAppContext } from 'src/contexts/app-context';
import { useLockerContext } from 'src/contexts/locker-context';
import { VeNFT } from 'src/contexts/locker-context/types';
import { useVeTravaListContext } from './context';
import { Status } from './useVeStatus';
import VeTravaGridList from './VeTravaGridList';
import VeTravaRowList from './VeTravaRowList';

export default function VeList() {
  const { data } = useLockerContext();
  const { filter } = useVeTravaListContext();
  const { contractAddresses } = useAppContext();

  const list = useMemo(() => {
    let l = data?.veNFTList ? Object.values(data.veNFTList) : [];
    l = filterByStatuses({ l });
    l = filterByTokens({ l });
    return l;
  }, [data?.veNFTList, filter]);

  const isBreakMode = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  function filterByStatuses({ l }: { l: VeNFT[] }) {
    const time = new Date().getTime();
    let dataFilter;
    if (filter.statuses.length === 0) return l;
    else if (filter.statuses.includes(Status.LOCKING) && filter.statuses.includes(Status.RELEASED)) return l;
    else if (filter.statuses.includes(Status.LOCKING)) {
      dataFilter = l.filter((item) => item.endTime > time);
    } else {
      dataFilter = l.filter((item) => item.endTime <= time);
    }
    return dataFilter;
  }

  function filterByTokens({ l }: { l: VeNFT[] }) {
    if (filter.tokens.length === 0) return l;
    const addresses = filter.tokens.map((item) => {
      if (item === 'TRAVA') return contractAddresses.TRAVA_TOKEN_ADDRESS.toLowerCase();
      else if (item === 'rTRAVA') return contractAddresses.RTRAVA_TOKEN_ADDRESS.toLowerCase();
      else return contractAddresses.TRAVA_BNB_TOKEN_ADDRESS.toLowerCase();
    });
    const dataFilter = l.filter((item) => {
      return addresses.includes(item.token.toLowerCase());
    });
    return dataFilter;
  }

  return (
    <Box>
      {list.length === 0 && <Empty py={4} />}
      {list.length > 0 && (isBreakMode ? <VeTravaGridList data={list} /> : <VeTravaRowList data={list} />)}
    </Box>
  );
}
