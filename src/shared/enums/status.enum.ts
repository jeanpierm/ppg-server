export enum EntityStatus {
  ACTIVE = 'A',
  INACTIVE = 'I',
}

export const STATUS_VALIDATION_MESSAGE = `Status must be '${EntityStatus.ACTIVE}' or '${EntityStatus.INACTIVE}'`;
