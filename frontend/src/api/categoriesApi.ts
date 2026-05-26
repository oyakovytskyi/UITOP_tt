import type { Category } from '../types/category';
import { apiClient } from './client';

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>('/categories');
  return data;
}
