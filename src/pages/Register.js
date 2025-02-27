// /src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  InputAdornment,
  IconButton
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import HeightIcon from '@mui/icons-material/Height';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import CustomAlert from '../components/CustomAlert';   // Tu componente de alerta
import LoaderOverlay from '../components/LoaderOverlay'; // Tu overlay de carga
import { API_URL } from '../services/api';


function Register() {
  const navigate = useNavigate();

  // Mensajes de error/éxito
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Estado de carga
  const [isLoading, setIsLoading] = useState(false);

  // Estado para los campos
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    postalCode: '',
    weight: '',
    height: '',
    objective: '',
  });
  const [profileImage, setProfileImage] = useState(null);

  // Mostrar/ocultar password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Manejo de cambios en los campos
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Manejo de archivo (imagen de perfil)
  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  // Toggles para password
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);
  const handleMouseDownPassword = (e) => e.preventDefault();

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validar contraseñas iguales
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden');
      return;
    }

    try {
      setIsLoading(true);

      // Construimos el FormData
      const data = new FormData();
      data.append('Email', formData.email);
      data.append('Password', formData.password);
      data.append('FirstName', formData.firstName);
      data.append('LastName', formData.lastName);
      data.append('PhoneNumber', formData.phoneNumber);
      data.append('Address', formData.address);
      data.append('PostalCode', formData.postalCode);
      data.append('Weight', formData.weight);
      data.append('Height', formData.height);
      data.append('Objective', formData.objective);

      if (profileImage) {
        data.append('ProfileImage', profileImage);
      }

      // Petición multipart/form-data sin Bearer token
      const response = await fetch(`${API_URL}/Auth/register`, {
        method: 'POST',
        body: data,
      });

      // Leemos la respuesta como texto
      const serverText = await response.text();

      if (!response.ok) {
        // Si el servidor respondió con error, mostramos el texto de error
        throw new Error(serverText || 'Error al registrar usuario');
      }

      // Si todo va bien, serverText debería ser "Usuario registrado. Revisa tu correo..."
      setSuccessMsg(serverText);

      // Esperamos 2 segundos para que el usuario vea el mensaje
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Apilado en móvil, lado a lado en escritorio
      }}
    >
      {isLoading && <LoaderOverlay />}

      {/* Columna Izquierda */}
      <Box
        sx={{
          flex: 1,
          width: { xs: '100%', md: '50%' },
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
          Registro Gymfront
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, maxWidth: 300, textAlign: 'center' }}>
          Crea una cuenta para gestionar tu gimnasio.
        </Typography>
      </Box>

      {/* Columna Derecha: Formulario */}
      <Box
        sx={{
          flex: 1,
          width: { xs: '100%', md: '50%' },
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
            maxWidth: 500,
            p: 4,
            borderRadius: 0,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Registrarse
          </Typography>

          {/* Alertas */}
          <CustomAlert severity="error" message={errorMsg} />
          <CustomAlert severity="success" message={successMsg} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* COLUMNA IZQUIERDA */}
              <Grid item xs={12} sm={6}>
                {/* Email */}
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: '#fff',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password */}
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: '#fff',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{ color: 'gray' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Confirm Password */}
                <TextField
                  label="Confirmar Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: '#fff',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{ color: 'gray' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Nombre */}
                <TextField
                  label="Nombre"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: '#fff',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Apellido */}
                <TextField
                  label="Apellido"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: '#fff',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Objetivo */}
                <TextField
                  label="Objetivo"
                  name="objective"
                  value={formData.objective}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: '#fff',
                    },
                  }}
                />
              </Grid>

              {/* COLUMNA DERECHA */}
              <Grid item xs={12} sm={6}>
                {/* Teléfono */}
                <TextField
                  label="Teléfono"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: '#fff',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Dirección */}
                <TextField
                  label="Dirección"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: '#fff',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Código Postal */}
                <TextField
                  label="Código Postal"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: '#fff',
                    },
                  }}
                />

                {/* Peso */}
                <TextField
                  label="Peso"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: '#fff',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FitnessCenterIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Estatura */}
                <TextField
                  label="Estatura"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: '#fff',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HeightIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Imagen de perfil */}
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    mt: 2,
                    backgroundColor: '#1E3C72',
                    ':hover': { backgroundColor: '#2A5298' },
                    borderRadius: '20px',
                  }}
                >
                  Subir Imagen de Perfil
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: '#1E3C72',
                ':hover': { backgroundColor: '#2A5298' },
                borderRadius: '20px',
              }}
            >
              Registrar
            </Button>
          </form>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, color: 'gray', cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default Register;