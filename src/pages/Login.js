// /src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { API_URL } from '../services/api';
import LoaderOverlay from '../components/LoaderOverlay'; // Importa el componente LoaderOverlay

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para la pantalla de carga
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true); // Mostrar pantalla de carga
    try {
      // Petición al endpoint de login usando la constante API_URL
      const response = await fetch(`${API_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Error al iniciar sesión');
      }

      const data = await response.json();
      // Guardar token y rol
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role || 'Cliente'); // si no hay 'role'
      localStorage.setItem('userId', data.userId);

      // Guardar datos del perfil
      const userProfile = data.userProfile || {};
      const firstName = userProfile.firstName || 'Usuario';
      const lastName = userProfile.lastName || 'Desconocido';

      // Ajusta la URL si necesitas concatenar un dominio a 'profilePictureUrl'
      const profilePictureUrl = userProfile.profilePictureUrl
        ? userProfile.profilePictureUrl
        : 'https://via.placeholder.com/150';

      localStorage.setItem('firstName', firstName);
      localStorage.setItem('lastName', lastName);
      localStorage.setItem('profilePictureUrl', profilePictureUrl);

      // Redirigir según el rol
      switch (data.role) {
        case 'SuperAdmin':
          navigate('/superadmin/dashboard');
          break;
        case 'Administrador':
          navigate('/admin/dashboard');
          break;
        case 'Entrenador':
          navigate('/entrenador/dashboard');
          break;
        case 'Vigilante':
          navigate('/vigilante/dashboard');
          break;
        default:
          // Cliente u otro rol
          navigate('/cliente/dashboard');
          break;
      }
    } catch (error) {
      setErrorMsg('Credenciales inválidas o error en el servidor.');
    } finally {
      setIsLoading(false); // Ocultar pantalla de carga
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        margin: 0,
        padding: 0,
      }}
    >
      {isLoading && <LoaderOverlay />} {/* Mostrar LoaderOverlay si isLoading es true */}

      {/* Columna Izquierda */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(to bottom right, #1E3C72, #2A5298)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          p: 4,
        }}
      >
        <Box
          component="img"
          src="/images/gymsmart.png"  // Ajusta la ruta de tu imagen
          alt="Logo Gym"
          sx={{
            width: { xs: '160px', md: '180px' },
            height: 'auto',
            maxWidth: '100%',
            mb: 2,
          }}
        />
        <Typography variant="h4" fontWeight="bold" align="center">
          Bienvenido a Gymfront
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, maxWidth: 300, textAlign: 'center' }}>
          Nuevo sistema de gestión de gimnasios.
        </Typography>
      </Box>

      {/* Columna Derecha: Formulario */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(to bottom right, #1E3C72, #2A5298)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          p: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 4,
            borderRadius: 0,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: '#1E3C72',
                ':hover': { backgroundColor: '#2A5298' },
              }}
            >
              Ingresar
            </Button>
          </form>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, color: 'gray', cursor: 'pointer' }}
            onClick={() => console.log('Recuperar contraseña')}
          >
            ¿Olvidaste tu contraseña?
          </Typography>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 1, color: 'gray', cursor: 'pointer' }}
            onClick={() => navigate('/register')}
          >
            Registrate
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;