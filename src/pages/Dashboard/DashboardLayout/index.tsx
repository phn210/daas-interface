import { Box, Grid, Skeleton, Typography, useMediaQuery } from '@mui/material';
import { Fragment } from 'react';
import TooltipInfo from 'src/components/TooltipInfo';
import { useDashboardContext } from 'src/contexts/dashboard-context';
import { formatNumber } from 'src/utils/format';
import { getAvgTime } from 'src/utils/lockTime';
import DAOVotingPower from '../DAOVotingPower';
import LockTimeHistogram from '../LockTimeHistogram';
import SingleInfo from '../SingleInfo';
import TotalInfo from '../TotalInfo';
import VeTravaHolders from '../VeTravaHolders';
import VotingPowerHistogram from '../VotingPowerHistogram';

interface InfoProps {
  title: string;
  info: string | number | undefined;
  tooltip: string;
}
const Info = (props: InfoProps) => {
  const { title, info, tooltip } = props;
  return (
    <Box
      sx={{
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
        {info ? info : <Skeleton width={100} animation="wave" variant="text" />}
      </Typography>
    </Box>
  );
};
export default function DashboardLayout() {
  const { data } = useDashboardContext();
  const md = useMediaQuery('(min-width:1300px)');
  const sm = useMediaQuery('(min-width:660px)');
  const overview = data?.overview;
  const veOverview = data?.veOverview;
  return (
    <Box>
      <Box display={md ? 'flex' : 'block'} justifyContent="space-between">
        <Box minWidth={md ? '50%' : '100%'}>
          <TotalInfo voted_locked={veOverview?.voted_locked} voting_power={veOverview?.voting_power} />
        </Box>
        <Box sx={{ mt: md ? 0 : 5, ml: md ? 2 : 0 }}>
          <Grid container spacing={{ md: '16px', xs: '8px' }}>
            <Grid item xs={sm ? 6 : 12}>
              <SingleInfo
                title="% voted-locked"
                info={
                  overview?.voted_locked_percent !== undefined
                    ? formatNumber(overview.voted_locked_percent, { fractionDigits: 2 }) + '%'
                    : undefined
                }
                tooltip="Percentage of total Trava and rTrava Locked including voting escrow only"
              />
            </Grid>
            <Grid item xs={sm ? 6 : 12}>
              <SingleInfo
                title="% total locked"
                info={
                  overview?.total_locked_percent !== undefined
                    ? formatNumber(overview.total_locked_percent, { fractionDigits: 2 }) + '%'
                    : undefined
                }
                tooltip="Percentage of total Trava and rTrava Locked"
              />
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                display: sm ? 'block' : 'none',
              }}
            >
              <Box
                sx={{
                  borderRadius: '10px',
                  boxSizing: 'border-box',
                  height: '123px',
                  px: 3,
                  py: 3,
                  bgcolor: 'background.paper',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Info
                  title="Avg. lock time"
                  info={overview?.avg_lock_time !== undefined ? getAvgTime(overview.avg_lock_time) : undefined}
                  tooltip="Average lock time"
                />
                <Info
                  title="% veTRAVA APR"
                  info={
                    overview?.apr !== undefined ? formatNumber(overview?.apr, { fractionDigits: 2 }) + '%' : undefined
                  }
                  tooltip="When participating in Trava DAO, users get rewards in TRAVA token. The APR shows how these rewards would be during 1-year period"
                />
                <Info
                  title="% warm up APR"
                  info={
                    overview?.apr !== undefined
                      ? formatNumber(overview?.warm_up_apr, { fractionDigits: 2 }) + '%'
                      : undefined
                  }
                  tooltip="The APR is for calculating the warm-up rewards"
                />
              </Box>
            </Grid>
            {!sm && (
              <Fragment>
                <Grid item xs={12}>
                  <SingleInfo
                    title="% Avg. lock time"
                    info={overview?.avg_lock_time !== undefined ? getAvgTime(overview.avg_lock_time) : undefined}
                    tooltip="Average lock time"
                  />
                </Grid>
                <Grid item xs={12}>
                  <SingleInfo
                    title="% veTRAVA APR"
                    info={
                      overview?.apr !== undefined ? formatNumber(overview?.apr, { fractionDigits: 2 }) + '%' : undefined
                    }
                    tooltip="When participating in Trava DAO, users get rewards in TRAVA token. The APR shows how these rewards would be during 1-year period"
                  />
                </Grid>
                <Grid item xs={12}>
                  <SingleInfo
                    title="%warm up APR"
                    info={
                      overview?.apr !== undefined
                        ? formatNumber(overview?.warm_up_apr, { fractionDigits: 2 }) + '%'
                        : undefined
                    }
                    tooltip="The APR is for calculating the warm-up rewards"
                  />
                </Grid>
              </Fragment>
            )}
          </Grid>
        </Box>
      </Box>
      <Grid container spacing={3} sx={{ mt: 5 }}>
        <Grid item xs={12}>
          <DAOVotingPower />
        </Grid>
        <Grid item md={6} xs={12}>
          <VotingPowerHistogram />
        </Grid>
        <Grid item md={6} xs={12}>
          <LockTimeHistogram />
        </Grid>
        <Grid item xs={12}>
          <VeTravaHolders />
        </Grid>
      </Grid>
    </Box>
  );
}
