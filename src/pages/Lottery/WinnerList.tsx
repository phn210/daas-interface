import { Grid, Typography } from '@mui/material';
import { ReferrerIcon } from 'src/icons';
import { formatAddress } from 'src/utils/format';

interface WinnerListProps {
  list: string[];
}

export default function WinnerList(props: WinnerListProps) {
  const { list } = props;

  return (
    <Grid container spacing={2} columns={10}>
      {list.map((address, index) => (
        <Grid key={address + index} item xs={5} sm={2}>
          <Typography
            color="secondary.main"
            gutterBottom
            variant="body3"
            sx={{ display: 'flex', alignItems: 'center', color: '#7994C1' }}
          >
            <ReferrerIcon fontSize="small" />
            &nbsp;{formatAddress(address)}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
}
