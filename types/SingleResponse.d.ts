interface SingleResponse<T> {
  result: boolean;
  message: string;
  data: T;
}
