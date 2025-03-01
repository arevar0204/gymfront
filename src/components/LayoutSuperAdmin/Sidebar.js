import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Button,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/material/styles';

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
  background: '#6359E9',
  color: '#FFFFFF',
  borderBottomRightRadius: '16px',
  borderTopRightRadius: '16px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    borderBottomRightRadius: '0px',
    borderTopRightRadius: '0px',
  },
});

// Drawer cerrado
const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  background: '#6359E9',
  color: '#FFFFFF',
  borderBottomRightRadius: '16px',
  borderTopRightRadius: '16px',
  [theme.breakpoints.down('sm')]: {
    width: '0px',
  },
});

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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  ...theme.mixins.toolbar,
}));

function Sidebar({ open, handleDrawerClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
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
      <Divider sx={{ backgroundColor: '#FFFFFF', opacity: 0.5, width: '80%', margin: '0 auto' }} />

      {/* Menú */}
      <List>
        <ListItem button onClick={() => navigate('/superadmin/dashboard')}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
        </ListItem>

        <Divider sx={{ backgroundColor: '#FFFFFF', opacity: 0.5, width: '80%', margin: '0 auto' }} />

        <ListItem button onClick={() => navigate('/superadmin/gimnasios')}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <FitnessCenterIcon />
          </ListItemIcon>
          <ListItemText primary="Gimnasios" sx={{ opacity: open ? 1 : 0 }} />
        </ListItem>

        <Divider sx={{ backgroundColor: '#FFFFFF', opacity: 0.5, width: '80%', margin: '0 auto' }} />

        <ListItem button onClick={() => navigate('/superadmin/administradores')}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <AdminPanelSettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Administradores" sx={{ opacity: open ? 1 : 0 }} />
        </ListItem>

        <Divider sx={{ backgroundColor: '#FFFFFF', opacity: 0.5, width: '80%', margin: '0 auto' }} />

        <ListItem button onClick={() => navigate('/superadmin/usuarios')}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Usuarios" sx={{ opacity: open ? 1 : 0 }} />
        </ListItem>

        <Divider sx={{ backgroundColor: '#FFFFFF', opacity: 0.5, width: '80%', margin: '0 auto' }} />

        <ListItem button onClick={() => navigate('/superadmin/configuracion')}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Configuración" sx={{ opacity: open ? 1 : 0 }} />
        </ListItem>
      </List>

      <Divider sx={{ marginTop: 'auto', backgroundColor: '#FFFFFF', opacity: 0.5, width: '80%', margin: '0 auto' }} />

      {/* Perfil y Logout */}
      <Box sx={{ textAlign: 'center', padding: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Avatar
            src={storedPhoto}
            alt="Perfil"
            sx={{
              width: open ? 60 : 40,
              height: open ? 60 : 40,
              border: '2px solid white',
              transition: 'width 0.3s, height 0.3s',
            }}
          />
          {open && (
            <Typography variant="body1" sx={{ color: '#FFFFFF', opacity: open ? 1 : 0, transition: 'opacity 0.3s' }}>
              {storedName}
            </Typography>
          )}
        </Box>
        {open ? (
          <Button onClick={handleLogout} sx={{ color: 'red', mt: 1 }}>
            Cerrar Sesión
          </Button>
        ) : (
          <IconButton onClick={handleLogout} sx={{ color: 'red', mt: 1 }}>
            <LogoutIcon />
          </IconButton>
        )}
      </Box>
    </Drawer>
  );
}

export default Sidebar;