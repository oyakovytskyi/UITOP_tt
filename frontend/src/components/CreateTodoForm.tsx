import { Box, Button, Stack, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import type { Category } from '../types/category';
import { CategorySelect } from './CategorySelect';

interface CreateTodoFormValues {
  text: string;
  categoryId: string;
}

interface CreateTodoFormProps {
  categories: Category[];
  isSubmitting: boolean;
  onSubmit: (text: string, categoryId: number) => Promise<void>;
}

export function CreateTodoForm({ categories, isSubmitting, onSubmit }: CreateTodoFormProps) {
  const defaultCategoryId = categories[0] ? String(categories[0].id) : '';

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTodoFormValues>({
    defaultValues: {
      text: '',
      categoryId: defaultCategoryId,
    },
  });

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values.text.trim(), Number(values.categoryId));
    reset({ text: '', categoryId: values.categoryId });
  });

  return (
    <Box component="form" onSubmit={submitHandler} sx={{ mb: 3 }}>
      <Stack spacing={2}>
        <TextField
          label="Task text"
          fullWidth
          disabled={isSubmitting || categories.length === 0}
          error={Boolean(errors.text)}
          helperText={errors.text?.message}
          {...register('text', {
            required: 'Task text is required',
            validate: (value) => value.trim().length > 0 || 'Task cannot be empty',
          })}
        />

        <Controller
          name="categoryId"
          control={control}
          rules={{ required: 'Category is required' }}
          render={({ field, fieldState }) => (
            <CategorySelect
              value={field.value}
              onChange={field.onChange}
              categories={categories}
              label="Category"
              disabled={isSubmitting}
              error={fieldState.error?.message ?? null}
            />
          )}
        />

        <Box>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || categories.length === 0}
          >
            Add task
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
