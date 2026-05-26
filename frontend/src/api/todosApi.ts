import type { CreateTodoPayload, Todo, UpdateTodoPayload } from '../types/todo';
import { apiClient } from './client';

export async function fetchTodos(categoryId?: number): Promise<Todo[]> {
  const params = categoryId !== undefined ? { category: categoryId } : undefined;
  const { data } = await apiClient.get<Todo[]>('/todos', { params });
  return data;
}

export async function createTodo(payload: CreateTodoPayload): Promise<Todo> {
  const { data } = await apiClient.post<Todo>('/todos', payload);
  return data;
}

export async function updateTodo(id: number, payload: UpdateTodoPayload): Promise<Todo> {
  const { data } = await apiClient.patch<Todo>(`/todos/${id}`, payload);
  return data;
}

export async function deleteTodo(id: number): Promise<void> {
  await apiClient.delete(`/todos/${id}`);
}
