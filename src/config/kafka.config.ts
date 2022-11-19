export enum KafkaEvents {
  OperationStatistics = 'operations-statistics',
  ServiceStarted = 'service-started',
  ServiceCreated = 'service-created',
}

export const KAFKA_BROKERS = process.env.BROKERS;
