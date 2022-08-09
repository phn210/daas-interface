export function formatNum(num: number | string): string {
  return '0'.repeat(5 - String(num).length) + num;
}
