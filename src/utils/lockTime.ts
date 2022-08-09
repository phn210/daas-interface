import { formatNumber } from './format';

export const getAvgTime = (time: number | undefined) => {
  if (!time) return 0;
  let unit, base;
  if (time < 604800) {
    unit = ' days';
    base = 86400;
  } else if (time < 31536000) {
    unit = ' mths';
    base = 2592000;
  } else {
    unit = ' yrs';
    base = 31536000;
  }
  return formatNumber(time / base, { fractionDigits: 2 }) + unit;
};

export const getHistogramAvgTime = (time: number | undefined, fractionDigits = 2) => {
  if (!time) return 0;
  let unit, base;
  if (time < 604800) {
    unit = 'D';
    base = 86400;
  } else if (time < 31536000) {
    unit = 'M';
    base = 2592000;
  } else {
    unit = 'Y';
    base = 31536000;
  }
  return formatNumber(time / base, { fractionDigits }) + unit;
};
