import { Box } from '@mui/material';
import { VeNFT } from 'src/contexts/locker-context/types';
import VeTravaListItem from './VeTravaRowListItem';

export default function VeTravaRowList({ data }: { data: VeNFT[] }) {
  return (
    <Box>
      {data.map((veNFT) => (
        <VeTravaListItem key={veNFT.id} data={veNFT} />
      ))}
    </Box>
  );
}
