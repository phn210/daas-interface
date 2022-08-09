import { Box, Paper, Typography } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useDashboardContext } from 'src/contexts/dashboard-context';
import useHighchartsDefaultConfig from 'src/hooks/useHighchartsDefaultConfig';
import { formatNumber } from 'src/utils/format';
import UtilChartButton from './UtilChartButton';

export default function DAOVotingPower() {
  const option_list = ['1W', '1M', '1Y', 'ALL'];
  const { data } = useDashboardContext();
  const [nIndex, setNIndex] = useState(0);
  const voting_powers = data?.voting_powers;
  const [timestamps, values] =
    voting_powers && voting_powers.length >= nIndex
      ? [
          Object.keys(voting_powers[nIndex])?.map((time) => parseInt(time) * 1000),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Object.values(voting_powers[nIndex])?.map((value: any) => value.voting_power),
        ]
      : [[], []];
  const defaultConfig = useHighchartsDefaultConfig();
  const options = useMemo<Highcharts.Options>(() => {
    const time = new Highcharts.Time({});

    return Highcharts.merge(defaultConfig, {
      chart: {
        type: 'areaspline',
        zoomType: 'x',
        height: '300',
      },
      title: {
        text: undefined,
      },
      tooltip: {
        xDateFormat: '%Y-%m-%d %I:%M:%S %p',
        shared: true,
        crosshairs: false,
        valueDecimals: 2,
        formatter: function (this: Highcharts.TooltipFormatterContextObject): string {
          if (!this.points) return '';
          return `<span style="font-size:11px">${moment(this.x).format('Y-MM-DD hh:MM:SS A')}</span>
            <br/><span style="color:${this.points[0].color}">\u25CF</span>
            ${this.points[0].series.name}:
            <b>
              ${formatNumber(this.points[0].y, {
                fractionDigits: 4,
                delimiter: ',',
              })}
            </b>`;
        },
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        gridLineWidth: 0,
        type: 'datetime',
        categories: timestamps,
        labels: {
          // eslint-disable-next-line no-unused-vars
          formatter: function (this: Highcharts.AxisLabelsFormatterContextObject): string {
            // eslint-disable-next-line quotes
            return time.dateFormat("%d %b '%y", Number(this.value));
          },
          y: 25,
        },
        tickInterval: Math.ceil(timestamps.length / 10),
      },
      yAxis: {
        ...defaultConfig.yAxis,
        gridLineWidth: 2,
        title: {
          text: undefined,
        },
        min: 0,
        endOnTick: false,
        showFirstLabel: false,
      },
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
          data: values,
          yAxis: 0,
        },
      ],
    });
  }, [defaultConfig, timestamps, values]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" whiteSpace="nowrap" gutterBottom>
        DAO Voting Power
      </Typography>

      <Paper sx={{ px: { md: 3, xs: 1 }, py: 2, flexGrow: 1 }}>
        <UtilChartButton
          butOption={nIndex}
          options={option_list}
          onClick={(index) => {
            setNIndex(index);
          }}
        />
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Paper>
    </Box>
  );
}
