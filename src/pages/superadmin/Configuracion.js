import React from "react";
import { Box, Typography, Button } from "@mui/material";

function Configuracion() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" color="primary">Configuración</Typography>
      <Typography variant="body1">Ajustes del perfil y cuenta.</Typography>

      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
        Editar Perfil
      </Button>
      <Button variant="contained" color="secondary" sx={{ mt: 2, ml: 2 }}>
        Cambiar Contraseña
      </Button>
    </Box>
  );
}

export default Configuracion;