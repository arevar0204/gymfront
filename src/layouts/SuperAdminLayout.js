import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  styled,
  createTheme,
  ThemeProvider,
} from '@mui/material/styles';
import {
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Toolbar,
  Typography,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

// Obtener datos del usuario desde localStorage
const storedName = localStorage.getItem('userName') || 'Bienvenido';
const storedPhoto = localStorage.getItem('profileImage') || '/images/profile.png';

// Tamaño del Drawer
const drawerWidth = 260;

// Drawer abierto
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  background: '#1E3C72',
  color: '#FFFFFF',
  borderBottomRightRadius: '16px',
});

// Drawer cerrado
const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  background: '#1E3C72',
  color: '#FFFFFF',
  borderBottomRightRadius: '16px',
});

// Header del Drawer
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  ...theme.mixins.toolbar,
}));

// AppBar estilizado
const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: '#2A5298',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

// Drawer estilizado
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
);

// Tema base
const customTheme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function SuperAdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);

  // Abrir/cerrar Drawer
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // Logout
  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* AppBar */}
        <AppBar position="fixed" open={open}>
          <Toolbar>
            {!open && (
              <IconButton
                color="inherit"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ marginRight: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <img src="/images/gymsmart.png" alt="GymSmart Logo" style={{ height: '50px', marginRight: '10px' }} />
            <Box sx={{ flexGrow: 1 }} />
          </Toolbar>
        </AppBar>

        {/* Drawer */}
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            {open && (
              <Typography variant="h6" sx={{ color: '#FFFFFF', marginLeft: 2 }}>
                Menú Principal
              </Typography>
            )}
            {open && (
              <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
                <ChevronLeftIcon />
              </IconButton>
            )}
          </DrawerHeader>
          <Divider />

          {/* Menú */}
          <List>
            <ListItem button onClick={() => navigate('/superadmin/dashboard')}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
            </ListItem>

            <ListItem button onClick={() => navigate('/superadmin/gimnasios')}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <FitnessCenterIcon />
              </ListItemIcon>
              <ListItemText primary="Gimnasios" sx={{ opacity: open ? 1 : 0 }} />
            </ListItem>

            <ListItem button onClick={() => navigate('/superadmin/administradores')}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Administradores" sx={{ opacity: open ? 1 : 0 }} />
            </ListItem>

            <ListItem button onClick={() => navigate('/superadmin/usuarios')}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Usuarios" sx={{ opacity: open ? 1 : 0 }} />
            </ListItem>

            <ListItem button onClick={() => navigate('/superadmin/configuracion')}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Configuración" sx={{ opacity: open ? 1 : 0 }} />
            </ListItem>
          </List>

          <Divider sx={{ marginTop: 'auto' }} />

          {/* Perfil y Logout */}
          <Box sx={{ textAlign: 'center', padding: 2 }}>
            <Avatar
              src={storedPhoto}
              alt="Perfil"
              sx={{
                width: open ? 60 : 40,
                height: open ? 60 : 40,
                margin: 'auto',
                border: '2px solid white',
                transition: 'width 0.3s, height 0.3s',
              }}
            />
            <Typography variant="body1" sx={{ color: '#FFFFFF', mt: 1, opacity: open ? 1 : 0, transition: 'opacity 0.3s' }}>
              {storedName}
            </Typography>
            <IconButton onClick={handleLogout} sx={{ color: 'red', mt: 1 }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Drawer>

        {/* Contenido principal */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
          <DrawerHeader />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default SuperAdminLayout;