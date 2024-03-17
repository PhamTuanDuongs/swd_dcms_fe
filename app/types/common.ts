export type PageResponse<T> = {
    totalPages: number;
    currentPage: number;
    data: T[];
};
