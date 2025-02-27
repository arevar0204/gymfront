import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    setUsuarios([
      { id: 1, nombre: "Carlos Gómez" },
      { id: 2, nombre: "Ana Torres" },
    ]);
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" color="primary">Usuarios</Typography>
      <Typography variant="body1">Lista de usuarios registrados.</Typography>

      <Box sx={{ mt: 3 }}>
        {usuarios.map((user) => (
          <Box key={user.id} sx={{ padding: 1, borderBottom: "1px solid #ddd" }}>
            <Typography variant="h6">{user.nombre}</Typography>
          </Box>
        ))}
      </Box>

      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
        Agregar Usuario
      </Button>
    </Box>
  );
}

export default Usuarios;