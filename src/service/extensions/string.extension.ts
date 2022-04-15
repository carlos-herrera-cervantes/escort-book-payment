export {};

declare global {
  interface Date {
    toCronExpression(): string;
  }
}

Date.prototype.toCronExpression = function (): string {
  const self = this as Date;
  
  const minutes = self.getMinutes();
  const hours = self.getHours();

  return `cron(${minutes} ${hours} * * ? *)`;
}