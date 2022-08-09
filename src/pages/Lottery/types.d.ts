export interface LotteryData {
  luckyNumbers?: number[];
  winnerList?: string[];
}

export interface LuckyNumberRangeData {
  ticket?: {
    id: number;
    head: number;
    tail: number;
  };
}
