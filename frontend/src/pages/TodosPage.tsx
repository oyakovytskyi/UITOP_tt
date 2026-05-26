import { Box, Chip, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { CreateTodoForm } from '../components/CreateTodoForm';
import { CategorySelect } from '../components/CategorySelect';
import { ErrorAlert } from '../components/ErrorAlert';
import { AppLoader } from '../components/AppLoader';
import { TodoList } from '../components/TodoList';
import { UndoSnackbar } from '../components/UndoSnackbar';
import { useCategories } from '../hooks/useCategories';
import { useTodoActions } from '../hooks/useTodoActions';
import { useTodos } from '../hooks/useTodos';

export function TodosPage() {
  const { categories, isLoading, error } = useCategories();
  const [categoryFilter, setCategoryFilter] = useState('');
  const { todos, isLoading: isTodosLoading, error: todosError, refetch } = useTodos(categoryFilter);
  const {
    snackbar,
    isSubmitting,
    pendingCompleteId,
    handleCreate,
    handleDelete,
    handleComplete,
    handleUndo,
    handleSnackbarClose,
  } = useTodoActions({ refetch });

  if (isLoading) {
    return <AppLoader message="Loading categories…" />;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        UITOP Todo
      </Typography>

      {error && <ErrorAlert message={error} />}

      <CreateTodoForm
        categories={categories}
        isSubmitting={isSubmitting}
        onSubmit={handleCreate}
      />

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

      <TodoList
        todos={todos}
        isLoading={isTodosLoading}
        error={todosError}
        categoryFilter={categoryFilter}
        pendingCompleteId={pendingCompleteId}
        onToggleComplete={handleComplete}
        onDelete={handleDelete}
      />

      <UndoSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onUndo={snackbar.undoType ? handleUndo : undefined}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}
