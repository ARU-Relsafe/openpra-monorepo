export enum JobBrokerKeys {
  RABBITMQ_URL = "RABBITMQ_URL",
  COMPLETED_JOB_QUEUE = "COMPLETED_JOB_QUEUE_NAME",
  INITIAL_JOB_QUEUE = "INITIAL_JOB_QUEUE_NAME",
  DISPATCH_QUEUE = "DISPATCH_QUEUE_NAME",
  DISPATCH_QUEUE_CORRELATION_ID = "DISPATCH_QUEUE_CORRELATION_ID",
  STORAGE_QUEUE = "STORAGE_QUEUE",
}

// TODO:: Fix this
export const JOB_BROKER_KEY_DEFAULTS: Record<string, string> = {
  RABBITMQ_URL: "localhost",
  COMPLETED_JOB_QUEUE: "DEFAULT_COMPLETED_JOB_QUEUE",
  INITIAL_JOB_QUEUE: "DEFAULT_INITIAL_JOB_QUEUE",
  DISPATCH_QUEUE: "DEFAULT_DISPATCH_QUEUE",
  DISPATCH_QUEUE_CORRELATION_ID: "",
  STORAGE_QUEUE: "DEFAULT_STORAGE_QUEUE",
};
