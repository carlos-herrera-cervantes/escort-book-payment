export {};

declare global {
  interface Number {
    calculatePercentage(percentage: number): number;
  }
}

Number.prototype.calculatePercentage = function (percentage: number): number {
  const self = this as number;
  return (self / 100) * percentage;
}
