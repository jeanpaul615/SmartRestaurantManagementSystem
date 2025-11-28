import {axiosInstance} from './axiosInstance';
import type { Product, CreateProductDto } from '@/shared/types/product.types';


export const productsApi = {
  getAll: () => axiosInstance.get<Product[]>('/products'),
  getById: (id: number) => axiosInstance.get<Product>(`/products/${id}`),
  create: (data: CreateProductDto) => axiosInstance.post<Product>('/products', data),
  update: (id: number, data: Partial<CreateProductDto>) => 
    axiosInstance.patch<Product>(`/products/${id}`, data),
  delete: (id: number) => axiosInstance.delete(`/products/${id}`),
};