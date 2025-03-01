import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Sidebar from '../components/LayoutSuperAdmin/Sidebar'; // Importamos Sidebar
import TopBar from '../components/LayoutSuperAdmin/TopBar'; // Importamos TopBar

// Tema base
const customTheme = createTheme();

function SuperAdminLayout() {
  const [open, setOpen] = useState(true);

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* Barra Superior */}
        <TopBar open={open} handleDrawerOpen={() => setOpen(true)} />

        {/* Sidebar */}
        <Sidebar open={open} handleDrawerClose={() => setOpen(false)} />

        {/* Contenido Principal - Agregar margen superior para que no quede oculto debajo de la AppBar */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default SuperAdminLayout;