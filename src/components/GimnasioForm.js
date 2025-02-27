import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Input,
  Box,
  Typography,
} from "@mui/material";
import LoaderOverlay from "./LoaderOverlay";
import CustomAlert from "./CustomAlert";
import { API_URL } from '../services/api'; // Importa la constante API_URL

function GimnasioForm({ open, handleClose, handleSave, gimnasioData }) {
  const [gimnasio, setGimnasio] = useState({
    nombre: "",
    calle: "",
    numeroInterior: "",
    numeroExterior: "",
    codigoPostal: "",
    estado: "",
    ciudad: "",
    numeroClientesPermitidos: "",
    numeroAdministradoresPermitidos: "",
    numeroVigilantesPermitidos: "",
    fotoPerfil: null,
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ severity: "", message: "" });

  useEffect(() => {
    if (gimnasioData) {
      setGimnasio({
        nombre: gimnasioData.nombre || "",
        calle: gimnasioData.calle || "",
        numeroInterior: gimnasioData.numeroInterior || "",
        numeroExterior: gimnasioData.numeroExterior || "",
        codigoPostal: gimnasioData.codigoPostal || "",
        estado: gimnasioData.estado || "",
        ciudad: gimnasioData.ciudad || "",
        numeroClientesPermitidos: gimnasioData.numeroClientesPermitidos || "",
        numeroAdministradoresPermitidos: gimnasioData.numeroAdministradoresPermitidos || "",
        numeroVigilantesPermitidos: gimnasioData.numeroVigilantesPermitidos || "",
        fotoPerfil: null, // La imagen se maneja por separado
      });
    }
  }, [gimnasioData]);

  const handleChange = (e) => {
    setGimnasio({ ...gimnasio, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setGimnasio({ ...gimnasio, fotoPerfil: e.target.files[0] });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setAlert({ severity: "", message: "" });

    const formData = new FormData();
    formData.append("Nombre", gimnasio.nombre);
    formData.append("Calle", gimnasio.calle);
    formData.append("NumeroInterior", gimnasio.numeroInterior);
    formData.append("NumeroExterior", gimnasio.numeroExterior);
    formData.append("CodigoPostal", gimnasio.codigoPostal);
    formData.append("Estado", gimnasio.estado);
    formData.append("Ciudad", gimnasio.ciudad);
    formData.append("NumeroClientesPermitidos", gimnasio.numeroClientesPermitidos);
    formData.append("NumeroAdministradoresPermitidos", gimnasio.numeroAdministradoresPermitidos);
    formData.append("NumeroVigilantesPermitidos", gimnasio.numeroVigilantesPermitidos);

    if (gimnasio.fotoPerfil) {
      formData.append("FotoPerfil", gimnasio.fotoPerfil);
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAlert({ severity: "error", message: "No tienes permiso para realizar esta acción." });
        return;
      }

      const url = gimnasioData ? `${API_URL}/Gimnacios/${gimnasioData.id}` : `${API_URL}/Gimnacios`;
      const method = gimnasioData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(gimnasioData ? "Error al actualizar gimnasio" : "Error al crear gimnasio");
      }

      setAlert({ severity: "success", message: gimnasioData ? "Gimnasio actualizado" : "Gimnasio creado con éxito" });
      handleSave(); // Recarga la lista de gimnasios
      handleClose(); // Cierra el modal
    } catch (error) {
      console.error(error);
      setAlert({ severity: "error", message: "Ocurrió un error, intenta nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      {loading && <LoaderOverlay />}
      <DialogTitle>{gimnasioData ? "Editar Gimnasio" : "Agregar Gimnasio"}</DialogTitle>
      <DialogContent>
        <CustomAlert severity={alert.severity} message={alert.message} />
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            {/* Nombre */}
            <Grid item xs={12}>
              <TextField fullWidth label="Nombre" name="nombre" value={gimnasio.nombre} onChange={handleChange} variant="outlined" />
            </Grid>

            {/* Dirección */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Calle" name="calle" value={gimnasio.calle} onChange={handleChange} variant="outlined" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth label="N° Interior" name="numeroInterior" value={gimnasio.numeroInterior} onChange={handleChange} variant="outlined" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth label="N° Exterior" name="numeroExterior" value={gimnasio.numeroExterior} onChange={handleChange} variant="outlined" />
            </Grid>

            {/* Código Postal y Estado */}
            <Grid item xs={6}>
              <TextField fullWidth label="Código Postal" name="codigoPostal" value={gimnasio.codigoPostal} onChange={handleChange} variant="outlined" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Estado" name="estado" value={gimnasio.estado} onChange={handleChange} variant="outlined" />
            </Grid>

            {/* Ciudad */}
            <Grid item xs={12}>
              <TextField fullWidth label="Ciudad" name="ciudad" value={gimnasio.ciudad} onChange={handleChange} variant="outlined" />
            </Grid>

            {/* Permisos */}
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Clientes Permitidos" name="numeroClientesPermitidos" value={gimnasio.numeroClientesPermitidos} onChange={handleChange} variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Admins Permitidos" name="numeroAdministradoresPermitidos" value={gimnasio.numeroAdministradoresPermitidos} onChange={handleChange} variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Vigilantes Permitidos" name="numeroVigilantesPermitidos" value={gimnasio.numeroVigilantesPermitidos} onChange={handleChange} variant="outlined" />
            </Grid>

            {/* Subir Imagen */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Foto de perfil:
              </Typography>
              <Input type="file" fullWidth name="fotoPerfil" onChange={handleFileChange} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {gimnasioData ? "Guardar Cambios" : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GimnasioForm;