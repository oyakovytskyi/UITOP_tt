import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import type { Category } from '../types/category';
import { ErrorAlert } from './ErrorAlert';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: Category[];
  isLoading?: boolean;
  error?: string | null;
  includeAll?: boolean;
  label?: string;
  disabled?: boolean;
}

export function CategorySelect({
  value,
  onChange,
  categories,
  isLoading = false,
  error = null,
  includeAll = false,
  label = 'Category',
  disabled = false,
}: CategorySelectProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <>
      {error && <ErrorAlert message={error} />}
      <FormControl fullWidth disabled={disabled || isLoading}>
        <InputLabel id="category-select-label">{label}</InputLabel>
        <Select
          labelId="category-select-label"
          value={value}
          label={label}
          onChange={handleChange}
        >
          {includeAll && <MenuItem value="">All</MenuItem>}
          {categories.map((category) => (
            <MenuItem key={category.id} value={String(category.id)}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        {isLoading && <FormHelperText>Loading categories…</FormHelperText>}
      </FormControl>
    </>
  );
}
