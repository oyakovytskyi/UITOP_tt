import { Alert, Button, Snackbar } from '@mui/material';

interface UndoSnackbarProps {
  open: boolean;
  message: string;
  severity?: 'success' | 'error';
  onUndo?: () => void;
  onClose: () => void;
}

export function UndoSnackbar({
  open,
  message,
  severity = 'success',
  onUndo,
  onClose,
}: UndoSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={onUndo ? undefined : 5000}
      onClose={(_, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        onClose();
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity={severity}
        variant="filled"
        onClose={onClose}
        action={
          onUndo ? (
            <Button color="inherit" size="small" onClick={onUndo}>
              Undo
            </Button>
          ) : undefined
        }
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
