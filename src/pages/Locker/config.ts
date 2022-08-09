import { isEnableTestnet } from 'src/constants';

export const timeLockOptions = isEnableTestnet
  ? [
      // {
      //   key: 20 * 60,
      //   value: '20 minutes',
      // },
      // {
      //   key: 40 * 60,
      //   value: '40 minutes',
      // },
      // {
      //   key: 60 * 60,
      //   value: '1 hour',
      // },
      // {
      //   key: 12 * 60 * 60,
      //   value: '12 hours',
      // },
      // {
      //   key: 24 * 60 * 60,
      //   value: '1 day',
      // },
      // {
      //   key: 3 * 24 * 60 * 60,
      //   value: '3 days',
      // },
      {
        key: 604800,
        value: '1 week',
      },
      {
        key: 2592000,
        value: '1 month',
      },
      {
        key: 3 * 30 * 24 * 3600,
        value: '3 months',
      },
      {
        key: 6 * 30 * 24 * 3600,
        value: '6 months',
      },
      {
        key: 365 * 24 * 3600,
        value: '1 year',
      },
      {
        key: 4 * 365 * 24 * 3600,
        value: '4 years',
      },
    ]
  : [
      {
        key: 7 * 24 * 3600,
        value: '1 week',
      },
      {
        key: 30 * 24 * 3600,
        value: '1 month',
      },
      {
        key: 3 * 30 * 24 * 3600,
        value: '3 months',
      },
      {
        key: 6 * 30 * 24 * 3600,
        value: '6 months',
      },
      {
        key: 365 * 24 * 3600,
        value: '1 year',
      },
      {
        key: 4 * 365 * 24 * 3600,
        value: '4 years',
      },
    ];

export const MAX_LOCK_TIME = Number(process.env.REACT_APP_MAX_LOCK_TIME) || timeLockOptions.slice(-1)[0].key;
export const MIN_LOCK_TIME = Number(process.env.REACT_APP_MIN_LOCK_TIME) || timeLockOptions[0].key;
