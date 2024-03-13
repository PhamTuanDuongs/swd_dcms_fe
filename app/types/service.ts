export interface Service {
    id?: number;
    name: string;
    price: number;
    description?: string;
}

export interface PageServiceResponse {
    totalPages: number;
    currentPage: number;
    services: Service[];
}
