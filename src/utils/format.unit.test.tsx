import { compactNumber, formatAddress, formatNumber, numberWithCommas } from './format';

describe('test format.ts', () => {
  describe('test formatAddress function', () => {
    test('should return the formatted address', () => {
      expect(formatAddress('0x219b6551Fc511BB6E977787DB77817faE19D0bA0')).toBe('0x219b...0bA0');
      expect(formatAddress('0x219b6551Fc511BB6E977787DB77817faE19D0bA0', 4, 6)).toBe('0x21...9D0bA0');
      expect(formatAddress('0x219b6551Fc511BB6E977787DB77817faE19D0bA0', 0, 6)).toBe('...9D0bA0');
      expect(formatAddress('0x12', 6, 4)).toBe('0x12...0x12');
      expect(formatAddress('0x12', 6, 2)).toBe('0x12...12');
      expect(formatAddress('0x12', 6, 5)).toBe('0x12...0x12');
      expect(formatAddress('', 6, 5)).toBe('...');
    });

    test('should throw error: Invalid parameter(s)', () => {
      const error = new Error('Invalid parameter(s)');
      expect(() => formatAddress('0x219b6551Fc511BB6E977787DB77817faE19D0bA0', -1)).toThrowError(error);
      expect(() => formatAddress('0x219b6551Fc511BB6E977787DB77817faE19D0bA0', 6, 0)).toThrowError(error);
      expect(() => formatAddress('0x219b6551Fc511BB6E977787DB77817faE19D0bA0', 6, -1)).toThrowError(error);
      expect(() => formatAddress('0x219b6551Fc511BB6E977787DB77817faE19D0bA0', -6, -6)).toThrowError(error);
    });
  });

  describe('test formatNumber function', () => {
    test('should return fallback if number is invalid', () => {
      const FallbackComp = () => <div>fallback</div>;

      expect(formatNumber('')).toBe('---');
      expect(formatNumber('180422a')).toBe('---');
      expect(formatNumber('180,422')).toBe('---');
      expect(formatNumber('1,180.422')).toBe('---');
      expect(formatNumber('1.180.422')).toBe('---');
      expect(formatNumber('a180422')).toBe('---');
      expect(formatNumber('string')).toBe('---');
      expect(formatNumber(undefined)).toBe('---');
      expect(formatNumber(null)).toBe('---');

      expect(formatNumber(undefined, { fallback: null })).toBe(null);
      expect(formatNumber(undefined, { fallback: 'xxx' })).toBe('xxx');
      expect(formatNumber(undefined, { fallback: 2 })).toBe(2);
      expect(formatNumber(undefined, { fallback: <FallbackComp /> })).toEqual(<FallbackComp />);
    });

    test('should return correct format', () => {
      expect(formatNumber(1422)).toBe('1,422');
      expect(formatNumber('0422')).toBe('422');
      expect(formatNumber('01422')).toBe('1,422');
      expect(formatNumber(180422)).toBe('180,422');
      expect(formatNumber('180422')).toBe('180,422');
      expect(formatNumber(100180422)).toBe('100,180,422');
      expect(formatNumber('100180422')).toBe('100,180,422');
      expect(formatNumber(1000180422)).toBe('1,000,180,422');
      expect(formatNumber('1000180422')).toBe('1,000,180,422');

      expect(formatNumber(0.422)).toBe('0.422');
      expect(formatNumber('.422')).toBe('0.422');
      expect(formatNumber(0.422422)).toBe('0.422422');
      expect(formatNumber('.422422')).toBe('0.422422');
      expect(formatNumber(0.422)).toBe('0.422');
      expect(formatNumber('0.422')).toBe('0.422');
      expect(formatNumber(180.422422)).toBe('180.422422');
      expect(formatNumber('180.422422')).toBe('180.422422');
      expect(formatNumber(1180.42)).toBe('1,180.42');
      expect(formatNumber('1180.42')).toBe('1,180.42');
      expect(formatNumber(1180.422422)).toBe('1,180.422422');
      expect(formatNumber('1180.422422')).toBe('1,180.422422');

      expect(formatNumber(18042022, { delimiter: ';' })).toBe('18;042;022');
      expect(formatNumber('18042022', { delimiter: ';' })).toBe('18;042;022');
      expect(formatNumber(18042022.002, { delimiter: ';' })).toBe('18;042;022.002');
      expect(formatNumber('18042022.002', { delimiter: ';' })).toBe('18;042;022.002');

      expect(formatNumber(18042022, { fractionDigits: 2 })).toBe('18,042,022');
      expect(formatNumber(18042022.002, { fractionDigits: 2 })).toBe('18,042,022');
      expect(formatNumber(18042022.006, { fractionDigits: 2 })).toBe('18,042,022.01');
      expect(formatNumber(18042022.6, { fractionDigits: 0 })).toBe('18,042,023');
      expect(formatNumber(18042022.002, { fractionDigits: 3 })).toBe('18,042,022.002');
      expect(formatNumber(18042022.002, { fractionDigits: 5 })).toBe('18,042,022.002');

      expect(formatNumber(20042022, { prefix: '~' })).toBe('~20,042,022');
      expect(formatNumber('20042022', { prefix: '~' })).toBe('~20,042,022');
      expect(formatNumber(20042022.002, { prefix: '~' })).toBe('~20,042,022.002');
      expect(formatNumber('20042022.002', { prefix: '~' })).toBe('~20,042,022.002');

      expect(formatNumber(20042022, { suffix: '$' })).toBe('20,042,022$');
      expect(formatNumber('20042022', { suffix: '$' })).toBe('20,042,022$');
      expect(formatNumber(20042022.002, { suffix: '$' })).toBe('20,042,022.002$');
      expect(formatNumber('20042022.002', { suffix: '$' })).toBe('20,042,022.002$');

      expect(formatNumber(20042022, { fractionDigits: 2, padZero: true })).toBe('20,042,022.00');
      expect(formatNumber('20042022', { fractionDigits: 2, padZero: true })).toBe('20,042,022.00');
      expect(formatNumber(20042022.002, { fractionDigits: 2, padZero: true })).toBe('20,042,022.00');
      expect(formatNumber('20042022.002', { fractionDigits: 2, padZero: true })).toBe('20,042,022.00');
      expect(formatNumber(20042022.002, { fractionDigits: 4, padZero: true })).toBe('20,042,022.0020');
      expect(formatNumber('20042022.002', { fractionDigits: 4, padZero: true })).toBe('20,042,022.0020');

      expect(formatNumber(18042022.002, { delimiter: ';', fractionDigits: 2 })).toBe('18;042;022');
      expect(formatNumber(18042022.002, { delimiter: ';', fractionDigits: 2, padZero: true })).toBe('18;042;022.00');
      expect(
        formatNumber(18042022.002, { delimiter: ';', fractionDigits: 2, padZero: true, prefix: '~', suffix: '$' })
      ).toBe('~18;042;022.00$');
    });
  });

  describe('test numberWithCommas function', () => {
    test('should throw error', () => {
      const error = new Error('Must provide a correct number');
      expect(() => numberWithCommas('')).toThrowError(error);
      expect(() => numberWithCommas('a')).toThrowError(error);
      expect(() => numberWithCommas('a.a')).toThrowError(error);
      expect(() => numberWithCommas('a.a', ';')).toThrowError(error);
    });

    test('should return number separate by commas', () => {
      expect(numberWithCommas(1)).toBe('1');
      expect(numberWithCommas(18042022)).toBe('18,042,022');
      expect(numberWithCommas(18042022.22)).toBe('18,042,022.22');
      // prettier-ignore
      expect(numberWithCommas(18042022.220)).toBe('18,042,022.22');
      // prettier-ignore
      expect(numberWithCommas(18042022.220)).toBe('18,042,022.22');
      expect(numberWithCommas(18042022.2222)).toBe('18,042,022.2222');
      expect(numberWithCommas('18042022.2222')).toBe('18,042,022.2222');
      // prettier-ignore
      expect(numberWithCommas(18042022.0000)).toBe('18,042,022');
      expect(numberWithCommas('18042022.0000')).toBe('18,042,022.0000');

      expect(numberWithCommas(18042022, ';')).toBe('18;042;022');
      expect(numberWithCommas(18042022.02, ';')).toBe('18;042;022.02');
      expect(numberWithCommas(18042022.02222, ';')).toBe('18;042;022.02222');
    });
  });

  describe('test compactNumber function', () => {
    test('should return compact string', () => {
      expect(compactNumber(1)).toBe('1');
      expect(compactNumber(1.234)).toBe('1.2');
      expect(compactNumber(12.345, 2)).toBe('12.3');
      expect(compactNumber(1234.356)).toBe('1.2K');
      expect(compactNumber(123456.1234)).toBe('120K');
      expect(compactNumber(1234567.89)).toBe('1.2M');
      expect(compactNumber(1234567890.111)).toBe('1.2B');
      expect(compactNumber(1111111111111.111)).toBe('1.1T');
    });
  });
  test('should throw error', () => {
    const error = new Error('Must provide a correct number');
    expect(() => compactNumber('')).toThrowError(error);
    expect(() => compactNumber('a')).toThrowError(error);
    expect(() => compactNumber('a.a')).toThrowError(error);
    expect(() => compactNumber('a.a', 2)).toThrowError(error);
  });
});
