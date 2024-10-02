export interface Pagination {
  size?: number;
  page?: number;
  rows: Array<object>;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const getPagination = ({
  page,
  size,
}: {
  page?: number;
  size?: number;
}) => {
  const take = size ? +size : 10;
  const skip = page ? page * take : 0;

  return { take, skip };
};

export const getPagingData = ({
  data,
  skip,
  take,
}: {
  data: any;
  skip: number;
  take: number;
}) => {
  return {
    rows: data && data[0],
    totalCount: data && data[1],
    totalPages: Math.ceil(data && Number(data[1]) / Number(take)),
    currentPage: Number(skip) + 1,
  };
};
