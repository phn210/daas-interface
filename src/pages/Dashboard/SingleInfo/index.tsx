import { Box, Typography, Skeleton } from '@mui/material';
import TooltipInfo from 'src/components/TooltipInfo';

interface SingleInfoProps {
  title: string;
  info: string | number | undefined;
  tooltip: string;
}
export default function SingleInfo(props: SingleInfoProps) {
  const { title, info, tooltip } = props;
  return (
    <Box
      sx={{
        borderRadius: '10px',
        boxSizing: 'border-box',
        height: '123px',
        px: 3,
        py: 3,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
      }}
    >
      <Typography
        color="secondary"
        style={{
          fontSize: '14px',
        }}
      >
        {title}{' '}
        {
          <TooltipInfo
            title={tooltip}
            iconProps={{
              sx: {
                fontSize: 'medium',
                verticalAlign: 'middle',
              },
            }}
          />
        }
      </Typography>
      <Typography
        color="secondary"
        variant="h1"
        style={{
          fontSize: '26px',
        }}
      >
        {info ? info : <Skeleton width={150} animation="wave" variant="text" />}
      </Typography>
    </Box>
  );
}
