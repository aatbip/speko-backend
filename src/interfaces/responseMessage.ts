export interface responseMessage<T> {
    status: "success" | "failure";
    data: T;
  }
  