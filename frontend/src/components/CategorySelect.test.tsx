/// <reference types="vitest/globals" />
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategorySelect } from './CategorySelect';

const categories = [
  { id: 1, name: 'Work' },
  { id: 2, name: 'Personal' },
  { id: 3, name: 'Health' },
];

function renderSelect(props: Partial<React.ComponentProps<typeof CategorySelect>> = {}) {
  const onChange = vi.fn();

  render(
    <ThemeProvider theme={createTheme()}>
      <CategorySelect
        value=""
        onChange={onChange}
        categories={categories}
        includeAll
        label="Filter by category"
        {...props}
      />
    </ThemeProvider>,
  );

  return { onChange };
}

describe('CategorySelect', () => {
  it('renders All and category options when opened', async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole('combobox', { name: /filter by category/i }));

    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Work' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Personal' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Health' })).toBeInTheDocument();
  });

  it('is disabled while loading', () => {
    renderSelect({ isLoading: true });

    expect(screen.getByRole('combobox', { name: /filter by category/i })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByText('Loading categories…')).toBeInTheDocument();
  });

  it('shows error alert when error is provided', () => {
    renderSelect({ error: 'Failed to load categories' });

    expect(screen.getByRole('alert')).toHaveTextContent('Failed to load categories');
  });
});
