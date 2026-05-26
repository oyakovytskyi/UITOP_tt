import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { Box, List, Typography } from '@mui/material';
import type { Todo } from '../types/todo';
import { AppLoader } from './AppLoader';
import { ErrorAlert } from './ErrorAlert';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  categoryFilter: string;
  pendingCompleteId: number | null;
  onToggleComplete: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export function TodoList({
  todos,
  isLoading,
  error,
  categoryFilter,
  pendingCompleteId,
  onToggleComplete,
  onDelete,
}: TodoListProps) {
  if (isLoading) {
    return <AppLoader message="Loading tasks…" />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (todos.length === 0) {
    return (
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
        <Typography variant="body1">No tasks</Typography>
        <Typography variant="body2">
          {categoryFilter
            ? 'No tasks in this category yet.'
            : 'Create a task to get started.'}
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          disabled={pendingCompleteId !== null && pendingCompleteId !== todo.id}
        />
      ))}
    </List>
  );
}
