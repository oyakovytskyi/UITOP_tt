import { useCallback, useEffect, useState } from 'react';
import { fetchTodos } from '../api/todosApi';
import type { Todo } from '../types/todo';
import { getErrorMessage } from '../utils/getErrorMessage';

async function loadTodosData(categoryFilter: string): Promise<{
  todos: Todo[];
  error: string | null;
}> {
  try {
    const categoryId = categoryFilter ? Number(categoryFilter) : undefined;
    const data = await fetchTodos(categoryId);
    return { todos: data, error: null };
  } catch (err) {
    return {
      todos: [],
      error: getErrorMessage(err, 'Failed to load tasks'),
    };
  }
}

export function useTodos(categoryFilter: string) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await loadTodosData(categoryFilter);
    setTodos(result.todos);
    setError(result.error);
    setIsLoading(false);
  }, [categoryFilter]);

  useEffect(() => {
    let cancelled = false;

    void loadTodosData(categoryFilter).then((result) => {
      if (cancelled) return;
      setTodos(result.todos);
      setError(result.error);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [categoryFilter]);

  return { todos, isLoading, error, refetch };
}
