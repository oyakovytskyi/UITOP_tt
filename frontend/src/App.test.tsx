/// <reference types="vitest/globals" />
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import App from './App';

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
