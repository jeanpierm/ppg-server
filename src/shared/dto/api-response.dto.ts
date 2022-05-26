import { ApiHideProperty } from '@nestjs/swagger';

export class ApiResponse<T = void> {
  message: string;

  @ApiHideProperty()
  data?: T;

  constructor(message: string, data?: T) {
    this.message = message;
    this.data = data;
  }
}
