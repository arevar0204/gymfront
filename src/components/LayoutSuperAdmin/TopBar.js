import React from 'react';
import { AppBar as MuiAppBar, Toolbar, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

// Tamaño del Drawer
const drawerWidth = 260;

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
    }),
  })
);

function TopBar({ open, handleDrawerOpen }) {
  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        {!open && (
          <IconButton color="inherit" onClick={handleDrawerOpen} edge="start">
            <MenuIcon />
          </IconButton>
        )}
        <img src="/images/gymsmart.png" alt="GymSmart Logo" style={{ height: '50px', marginLeft: '15px' }} />
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;