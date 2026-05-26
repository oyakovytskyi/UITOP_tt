/// <reference types="vitest/globals" />
import { renderHook, waitFor } from '@testing-library/react';
import { fetchCategories } from '../api/categoriesApi';
import { useCategories } from './useCategories';

vi.mock('../api/categoriesApi', () => ({
  fetchCategories: vi.fn(),
}));

const mockFetchCategories = vi.mocked(fetchCategories);

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns categories on success', async () => {
    const categories = [
      { id: 1, name: 'Work' },
      { id: 2, name: 'Personal' },
    ];
    mockFetchCategories.mockResolvedValue(categories);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.categories).toEqual(categories);
    expect(result.current.error).toBeNull();
  });

  it('sets error on failure', async () => {
    mockFetchCategories.mockRejectedValue({
      response: { data: { message: 'Network error' } },
      isAxiosError: true,
    });

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.categories).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });
});
