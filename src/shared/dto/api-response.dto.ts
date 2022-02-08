export class ApiResponse<T = void> {
  constructor(public message: string, public data?: T) {}
}
