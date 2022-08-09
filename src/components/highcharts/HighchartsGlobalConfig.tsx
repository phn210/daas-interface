import Highcharts from 'highcharts';
import { useEffect } from 'react';

export default function HighchartsGlobalConfig() {
  useEffect(() => {
    Highcharts.setOptions({
      credits: {
        enabled: false,
      },
      chart: {
        backgroundColor: 'transparent',
        style: {
          // eslint-disable-next-line quotes
          fontFamily: "'Roboto', sans-serif",
          fontSize: '12px',
        },
      },
      colors: [
        '#25a0e2',
        '#e4c9ff',
        '#90ed7d',
        '#f7a35b',
        '#8085e9',
        '#1aadce',
        '#492970',
        '#f28f43',
        '#77a1e5',
        '#c42525',
      ],
      time: {
        useUTC: false,
      },
      tooltip: {
        backgroundColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 0.6 },
          stops: [
            [0, '#FFFFFF'],
            [1, '#E0E0E0'],
          ],
        },
      },
    });
  }, []);

  return null;
}
