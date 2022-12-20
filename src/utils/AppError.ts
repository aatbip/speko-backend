export interface IAppError {
    type: string;
    message: string;
    statusCode: number;
  }
  
  class AppError extends Error implements IAppError {
    constructor(
      public type: string,
      public message: string,
      public statusCode: number
    ) {
      super(message);
      this.type = type;
      this.message = message;
      this.statusCode = statusCode;
    }
  }
  
  export { AppError };
  