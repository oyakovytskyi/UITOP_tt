import { useCallback, useEffect, useState } from 'react';
import { fetchCategories } from '../api/categoriesApi';
import type { Category } from '../types/category';
import { getErrorMessage } from '../utils/getErrorMessage';

async function loadCategoriesData(): Promise<{
  categories: Category[];
  error: string | null;
}> {
  try {
    const data = await fetchCategories();
    return { categories: data, error: null };
  } catch (err) {
    return {
      categories: [],
      error: getErrorMessage(err, 'Failed to load categories'),
    };
  }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void loadCategoriesData().then((result) => {
      if (cancelled) return;
      setCategories(result.categories);
      setError(result.error);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await loadCategoriesData();
    setCategories(result.categories);
    setError(result.error);
    setIsLoading(false);
  }, []);

  return { categories, isLoading, error, refetch };
}
