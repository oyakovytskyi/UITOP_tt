import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { AppLoader } from '../components/AppLoader';
import { CategorySelect } from '../components/CategorySelect';
import { ErrorAlert } from '../components/ErrorAlert';
import { useCategories } from '../hooks/useCategories';

export function TodosPage() {
  const { categories, isLoading, error } = useCategories();
  const [categoryFilter, setCategoryFilter] = useState('');

  if (isLoading) {
    return <AppLoader message="Loading categories…" />;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        UITOP Todo
      </Typography>

      {error && <ErrorAlert message={error} />}

      <Box sx={{ mb: 3, maxWidth: 320 }}>
        <CategorySelect
          value={categoryFilter}
          onChange={setCategoryFilter}
          categories={categories}
          includeAll
          label="Filter by category"
        />
      </Box>

      {categories.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          {categories.map((category) => (
            <Chip key={category.id} label={category.name} variant="outlined" />
          ))}
        </Stack>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          py: 6,
          color: 'text.secondary',
        }}
      >
        <AssignmentOutlinedIcon sx={{ fontSize: 48, opacity: 0.5 }} />
        <Typography variant="body1">No tasks yet</Typography>
        <Typography variant="body2">
          {categoryFilter
            ? 'Tasks for selected category will appear here.'
            : 'Todo list will appear here.'}
        </Typography>
      </Box>
    </Box>
  );
}
