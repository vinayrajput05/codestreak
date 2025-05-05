class ApiResponse<T = any> {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;

  constructor(statusCode: number, data: T, message: string = 'Success') {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.data = data;
  }
}

export default ApiResponse;
