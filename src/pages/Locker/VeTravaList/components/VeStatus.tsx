import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Typography, TypographyProps } from '@mui/material';
import { Status, useVeStatus } from '../useVeStatus';

interface VeStatusProps extends TypographyProps {
  endTime: number;
  refreshDuration: number;
}

export default function VeStatus({ endTime, refreshDuration, ...other }: VeStatusProps) {
  const status = useVeStatus(endTime, refreshDuration);

  return (
    <Typography
      sx={{ display: 'flex', alignItems: 'center' }}
      color={status === Status.LOCKING ? 'success.main' : 'warning.main'}
      {...other}
    >
      <FiberManualRecordIcon fontSize="small" />
      &nbsp;
      {status}
    </Typography>
  );
}

VeStatus.defaultProps = {
  refreshDuration: 60000, // in ms
};
