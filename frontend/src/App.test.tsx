/// <reference types="vitest/globals" />
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('./hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [
      { id: 1, name: 'Work' },
      { id: 2, name: 'Personal' },
      { id: 3, name: 'Health' },
    ],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

describe('App', () => {
  it('renders app title', () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <App />
      </ThemeProvider>,
    );

    expect(screen.getByRole('heading', { name: /uitop todo/i })).toBeInTheDocument();
  });
});
