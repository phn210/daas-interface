import { Box, Skeleton, Typography } from '@mui/material';
import TooltipInfo from 'src/components/TooltipInfo';
import { buildPathToPublicResource } from 'src/utils';
import { formatNumber } from 'src/utils/format';

interface TotalInfoProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  voted_locked: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  voting_power: any;
}
export default function TotalInfo(props: TotalInfoProps) {
  const { voted_locked, voting_power } = props;

  return (
    <Box
      sx={{
        backgroundImage: `url(${buildPathToPublicResource('images/dashboard/bg_shield.png')})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no repeat',
        backgroundPosition: 'bottom right',
        borderRadius: '10px',
        boxSizing: 'border-box',
        position: 'relative',
        height: '261px',
        width: '100%',
        pl: {
          md: '24px',
          xs: '20px',
        },
        pt: {
          md: '24px',
          xs: '20px',
        },
      }}
    >
      <img
        src={buildPathToPublicResource('images/dashboard/shield.png')}
        style={{
          width: '200px',
          position: 'absolute',
          right: '10px',
          bottom: '-55px',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <Typography color="white">
          Total TRAVA voted-locked{' '}
          {
            <TooltipInfo
              title="Total TRAVA and rTRAVA Locked including voting escrow only"
              iconProps={{
                sx: {
                  verticalAlign: 'middle',
                },
              }}
            />
          }
        </Typography>
        <Typography variant="h1" color="white" sx={{ mt: 1 }}>
          {voted_locked ? (
            formatNumber(voted_locked, { fractionDigits: 2, delimiter: ',' })
          ) : (
            <Skeleton variant="text" width={200} animation="wave" />
          )}
        </Typography>
      </Box>
      <Box
        sx={{
          paddingTop: 8,
          position: 'relative',
        }}
      >
        <Typography color="white">
          Total Voting Power{' '}
          {
            <TooltipInfo
              title="The current total voting power of the system"
              iconProps={{
                sx: {
                  verticalAlign: 'middle',
                },
              }}
            />
          }
        </Typography>
        <Typography variant="h1" color="white" sx={{ mt: 1 }}>
          {voting_power ? (
            formatNumber(voting_power, { fractionDigits: 2, delimiter: ',' })
          ) : (
            <Skeleton variant="text" width={200} animation="wave" />
          )}
        </Typography>
      </Box>
    </Box>
  );
}
