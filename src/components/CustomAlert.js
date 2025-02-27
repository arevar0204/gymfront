import { Alert, Typography } from '@mui/material';

function CustomAlert({ severity, message }) {
  if (!message) return null; // Si no hay mensaje, no se muestra nada

  return (
    <Alert severity={severity} sx={{ mb: 2 }}>
      <Typography variant="body2">{message}</Typography>
    </Alert>
  );
}

export default CustomAlert;