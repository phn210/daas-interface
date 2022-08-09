import { Grid } from '@mui/material';
import { VeNFT } from 'src/contexts/locker-context/types';
import VeTravaGridListItem from './VeTravaGridListItem';

export default function VeTravaGridList({ data }: { data: VeNFT[] }) {
  return (
    <Grid container spacing={3}>
      {data.map((veNFT) => (
        <VeTravaGridListItem key={veNFT.id} data={veNFT} xs={12} sm={6} />
      ))}
    </Grid>
  );
}
