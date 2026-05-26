import { useCallback, useEffect, useRef, useState } from 'react';
import { createTodo, deleteTodo, updateTodo } from '../api/todosApi';
import type { Todo } from '../types/todo';
import { getErrorMessage } from '../utils/getErrorMessage';

const UNDO_TIMEOUT_MS = 5000;

interface DeleteUndoPayload {
  text: string;
  categoryId: number;
}

interface CompleteUndoPayload {
  id: number;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
  undoType: 'delete' | 'complete' | null;
}

const initialSnackbarState: SnackbarState = {
  open: false,
  message: '',
  severity: 'success',
  undoType: null,
};

interface UseTodoActionsOptions {
  refetch: () => Promise<void>;
}

export function useTodoActions({ refetch }: UseTodoActionsOptions) {
  const [snackbar, setSnackbar] = useState<SnackbarState>(initialSnackbarState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingCompleteId, setPendingCompleteId] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deletePayloadRef = useRef<DeleteUndoPayload | null>(null);
  const completePayloadRef = useRef<CompleteUndoPayload | null>(null);

  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const dismissSnackbar = useCallback(() => {
    clearPendingTimeout();
    setSnackbar(initialSnackbarState);
    deletePayloadRef.current = null;
    completePayloadRef.current = null;
    setPendingCompleteId(null);
  }, [clearPendingTimeout]);

  useEffect(() => {
    return () => {
      clearPendingTimeout();
    };
  }, [clearPendingTimeout]);

  const showErrorSnackbar = useCallback((message: string) => {
    clearPendingTimeout();
    deletePayloadRef.current = null;
    completePayloadRef.current = null;
    setPendingCompleteId(null);
    setSnackbar({
      open: true,
      message,
      severity: 'error',
      undoType: null,
    });
  }, [clearPendingTimeout]);

  const handleCreate = useCallback(
    async (text: string, categoryId: number) => {
      setIsSubmitting(true);
      try {
        await createTodo({ text, categoryId });
        await refetch();
      } catch (err) {
        showErrorSnackbar(getErrorMessage(err, 'Failed to create task'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [refetch, showErrorSnackbar],
  );

  const handleDelete = useCallback(
    async (todo: Todo) => {
      clearPendingTimeout();
      deletePayloadRef.current = { text: todo.text, categoryId: todo.category.id };
      completePayloadRef.current = null;
      setPendingCompleteId(null);

      try {
        await deleteTodo(todo.id);
        await refetch();
        setSnackbar({
          open: true,
          message: 'Task deleted',
          severity: 'success',
          undoType: 'delete',
        });

        timeoutRef.current = setTimeout(() => {
          dismissSnackbar();
        }, UNDO_TIMEOUT_MS);
      } catch (err) {
        deletePayloadRef.current = null;
        showErrorSnackbar(getErrorMessage(err, 'Failed to delete task'));
      }
    },
    [clearPendingTimeout, dismissSnackbar, refetch, showErrorSnackbar],
  );

  const handleComplete = useCallback(
    async (todo: Todo) => {
      if (pendingCompleteId !== null) {
        return;
      }

      clearPendingTimeout();
      deletePayloadRef.current = null;
      completePayloadRef.current = { id: todo.id };
      setPendingCompleteId(todo.id);

      try {
        await updateTodo(todo.id, { completed: true });
        await refetch();
        setSnackbar({
          open: true,
          message: 'Task completed',
          severity: 'success',
          undoType: 'complete',
        });

        timeoutRef.current = setTimeout(async () => {
          const payload = completePayloadRef.current;
          dismissSnackbar();

          if (!payload) {
            return;
          }

          try {
            await deleteTodo(payload.id);
            await refetch();
          } catch (err) {
            showErrorSnackbar(getErrorMessage(err, 'Failed to remove completed task'));
          }
        }, UNDO_TIMEOUT_MS);
      } catch (err) {
        completePayloadRef.current = null;
        setPendingCompleteId(null);
        showErrorSnackbar(getErrorMessage(err, 'Failed to complete task'));
      }
    },
    [clearPendingTimeout, dismissSnackbar, pendingCompleteId, refetch, showErrorSnackbar],
  );

  const handleUndo = useCallback(async () => {
    const deletePayload = deletePayloadRef.current;
    const completePayload = completePayloadRef.current;

    clearPendingTimeout();

    if (deletePayload) {
      dismissSnackbar();
      try {
        await createTodo({
          text: deletePayload.text,
          categoryId: deletePayload.categoryId,
        });
        await refetch();
      } catch (err) {
        showErrorSnackbar(getErrorMessage(err, 'Failed to restore task'));
      }
      return;
    }

    if (completePayload) {
      dismissSnackbar();
      try {
        await updateTodo(completePayload.id, { completed: false });
        await refetch();
      } catch (err) {
        showErrorSnackbar(getErrorMessage(err, 'Failed to undo completion'));
      }
    }
  }, [clearPendingTimeout, dismissSnackbar, refetch, showErrorSnackbar]);

  const handleSnackbarClose = useCallback(() => {
    if (snackbar.undoType === 'complete' && completePayloadRef.current) {
      const payload = completePayloadRef.current;
      dismissSnackbar();

      void (async () => {
        try {
          await deleteTodo(payload.id);
          await refetch();
        } catch (err) {
          showErrorSnackbar(getErrorMessage(err, 'Failed to remove completed task'));
        }
      })();
      return;
    }

    dismissSnackbar();
  }, [dismissSnackbar, refetch, showErrorSnackbar, snackbar.undoType]);

  return {
    snackbar,
    isSubmitting,
    pendingCompleteId,
    handleCreate,
    handleDelete,
    handleComplete,
    handleUndo,
    handleSnackbarClose,
  };
}
