import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {
  Checkbox,
  Chip,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  disabled?: boolean;
}

export function TodoItem({ todo, onToggleComplete, onDelete, disabled = false }: TodoItemProps) {
  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label={`Delete task ${todo.text}`}
          onClick={() => onDelete(todo)}
          disabled={disabled}
        >
          <DeleteOutlinedIcon />
        </IconButton>
      }
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        mb: 1,
        bgcolor: 'background.paper',
      }}
    >
      <ListItemIcon sx={{ minWidth: 42 }}>
        <Checkbox
          edge="start"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo)}
          disabled={disabled || todo.completed}
          slotProps={{ input: { 'aria-label': `Mark ${todo.text} as completed` } }}
        />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant="body1"
            sx={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? 'text.secondary' : 'text.primary',
            }}
          >
            {todo.text}
          </Typography>
        }
        secondary={<Chip label={todo.category.name} size="small" variant="outlined" sx={{ mt: 0.5 }} />}
      />
    </ListItem>
  );
}
