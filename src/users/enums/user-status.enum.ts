export enum UserStatus {
  ACTIVE = 'A',
  INACTIVE = 'I',
}

export const STATUS_VALIDATION_MESSAGE = `User status must be '${UserStatus.ACTIVE}' or '${UserStatus.INACTIVE}'`;
