export enum EntityStatus {
  Active = 'A',
  Inactive = 'I',
}

export const STATUS_VALIDATION_MESSAGE = `Status must be '${EntityStatus.Active}' or '${EntityStatus.Inactive}'`;
