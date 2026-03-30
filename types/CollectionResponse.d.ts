interface CollectionResponse<T> {
  result: boolean;
  message: string;
  data: {
    models: T[];
    pagination: Pagination;
  };
}
