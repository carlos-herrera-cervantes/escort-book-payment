import { TimeUnit } from '../enums/time-unit.enum';

export {};

declare global {
  interface Date {
    addServiceTime(quantity: number, timeUnit: string, now: Date): Date;
    toCronExpression(): string;
  }
}

Date.prototype.addServiceTime = function (quantity: number, timeUnit: string, now: Date): Date {
  const self = this as Date;

  if (timeUnit == TimeUnit.Minutes) {
    self.setMinutes(now.getMinutes() + quantity);
  }

  if (timeUnit == TimeUnit.Hour) {
    self.setHours(now.getHours() + quantity);
  }

  if (timeUnit == TimeUnit.Night) {
    self.setHours(now.getHours() + (quantity * 8));
  }

  return self;
}

Date.prototype.toCronExpression = function (): string {
  const self = this as Date;
  
  const minutes = self.getMinutes();
  const hours = self.getHours();

  return `cron(${minutes} ${hours} * * ? *)`;
}