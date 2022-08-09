import { Box, Paper, Typography } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { useEffect, useMemo, useRef } from 'react';
import { FetchingStatus } from 'src/constants';
import { useLockerContext } from 'src/contexts/locker-context';
import useHighchartsDefaultConfig from 'src/hooks/useHighchartsDefaultConfig';
import { formatNumber } from 'src/utils/format';
import TimeOptions from './TimeOptions';

// const dataDemo = {
//   categories: [1649523600000, 1649610000000, 1649696400000, 1649782800000, 1649869200000, 1649955600000],
//   votingPower: [100, 200, 300, 230, 300, 323],
//   percentage: [10, 20, 30, 75, 30, 90],
// };

export default function VotingPowerHistory() {
  const defaultConfig = useHighchartsDefaultConfig();
  const hcRef = useRef<HighchartsReact.RefObject | null>(null);
  const { votingPowerStatus: status, data } = useLockerContext();

  useEffect(() => {
    if (hcRef !== null && hcRef.current?.chart) {
      if (status === FetchingStatus.IDLE || status === FetchingStatus.FETCHING || status === FetchingStatus.UPDATING) {
        hcRef.current.chart.showLoading();
      } else {
        hcRef.current.chart.hideLoading();
      }
    }
  }, [status]);

  const [categories, votingPower, percentage] = useMemo(() => {
    let _categories: Array<number> = [],
      _votingPower: Array<number> = [],
      _percentage: Array<number> = [];

    if (data?.votingPowerHistory?.votingLogs) {
      _categories = [...data.votingPowerHistory.votingLogs.categories];
      _votingPower = [...data.votingPowerHistory.votingLogs.votingPower];
      _percentage = [...data.votingPowerHistory.votingLogs.percentage];
    }

    return [_categories, _votingPower, _percentage];
  }, [data.votingPowerHistory]);

  const options = useMemo<Highcharts.Options>(() => {
    const time = new Highcharts.Time({});

    return Highcharts.merge(defaultConfig, {
      chart: {
        type: 'areaspline',
        zoomType: 'x',
        height: '220',
      },
      title: {
        text: undefined,
      },
      tooltip: {
        xDateFormat: '%Y-%m-%d %I:%M:%S %p',
        shared: true,
        crosshairs: false,
        headerFormat: {},
        formatter: function (this: Highcharts.TooltipFormatterContextObject): string {
          if (!this.points) return '';
          return `<span style="font-size:11px">${moment(this.x).format('Y-MM-DD hh:MM:SS A')}</span>
            <br/><span style="color:${this.points[0].color}">\u25CF</span>
            ${this.points[0].series.name}:
            <b>
              ${formatNumber(this.points[0].y, {
                fractionDigits: 4,
                delimiter: '',
              })}
            </b>
            <br/><span style="color:${this.points[1].color}">\u25CF</span>
            ${this.points[1].series.name}: 
            <b>
              ${formatNumber(this.points[1].y, {
                fractionDigits: 2,
                delimiter: '',
              })}
            </b>`;
        },
      },
      legend: {
        y: 20,
      },
      xAxis: {
        gridLineWidth: 0,
        type: 'datetime',
        categories: categories,
        tickInterval: Math.ceil(categories.length / 6),
        labels: {
          // eslint-disable-next-line no-unused-vars
          formatter: function (this: Highcharts.AxisLabelsFormatterContextObject): string {
            // eslint-disable-next-line quotes
            return time.dateFormat("%d %b '%y", Number(this.value));
          },
        },
      },
      yAxis: [
        {
          ...defaultConfig.yAxis,
          gridLineWidth: 1,
          title: {
            text: undefined,
          },
          showFirstLabel: false,
          tooltipValueFormat: '{value:.4f}',
        },
        {
          ...defaultConfig.yAxis,
          gridLineWidth: 0,
          opposite: true,
          title: {
            text: undefined,
          },
          min: 0,
          max: 100,
          endOnTick: false,
          showFirstLabel: false,
          tooltipValueFormat: '{value:.2f}',
        },
      ],
      plotOptions: {
        areaspline: {
          fillOpacity: 0.2,
          marker: {
            radius: 0,
            symbol: 'circle',
            states: {
              hover: {
                radius: 5,
              },
            },
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          threshold: null,
        },
      },
      series: [
        {
          name: 'Voting Power',
          data: votingPower,
          yAxis: 0,
        },
        {
          name: 'Percentage',
          data: percentage,
          yAxis: 1,
        },
      ],
    });
  }, [defaultConfig, categories, votingPower, percentage]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" whiteSpace="nowrap" gutterBottom>
        Your Voting Power
      </Typography>
      <Paper sx={{ p: 2, flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: { xsm: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', xsm: 'row' },
            width: '100%',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'baseline', mb: { xs: 1, xsm: 0 } }}>
            <Typography color="text.secondary">
              Current Voting Power&nbsp;
              <Typography color="primary.main" variant="h4" component="span">
                {formatNumber(data?.votingPowerHistory?.currentVotingPower, { fractionDigits: 2, fallback: 'N/A' })}
              </Typography>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: { xs: '100%', xsm: 'auto' } }}>
            <TimeOptions />
          </Box>
        </Box>
        <HighchartsReact ref={hcRef} highcharts={Highcharts} options={options} />
      </Paper>
    </Box>
  );
}
