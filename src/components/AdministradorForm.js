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
  CircularProgress,
} from "@mui/material";
import { API_URL } from '../services/api'; // Importa la constante API_URL

function AdministradorForm({ open, handleClose, handleSave, adminData }) {
  const [admin, setAdmin] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    postalCode: "",
    weight: "",
    height: "",
    objective: "",
    profileImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Si es edición, llenar los campos con los datos actuales
  useEffect(() => {
    if (adminData) {
      setAdmin({ ...adminData, profileImage: null }); // Evitar pre-cargar la imagen
    } else {
      setAdmin({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        postalCode: "",
        weight: "",
        height: "",
        objective: "",
        profileImage: null,
      });
    }
  }, [adminData]);

  // Manejo de cambios en los campos de texto
  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  // Manejo de cambio en la imagen de perfil
  const handleFileChange = (e) => {
    setAdmin({ ...admin, profileImage: e.target.files[0] });
  };

  // Enviar datos
  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("Email", admin.email);
    formData.append("Password", admin.password);
    formData.append("FirstName", admin.firstName);
    formData.append("LastName", admin.lastName);
    formData.append("PhoneNumber", admin.phoneNumber);
    formData.append("Address", admin.address);
    formData.append("PostalCode", admin.postalCode);
    formData.append("Weight", admin.weight);
    formData.append("Height", admin.height);
    formData.append("Objective", admin.objective);

    if (admin.profileImage) {
      formData.append("ProfileImage", admin.profileImage);
    }

    try {
      const token = localStorage.getItem("token");
      const url = adminData ? `${API_URL}/api/Administradores/${adminData.id}` : `${API_URL}/Administradores/crear`;
      const method = adminData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(adminData ? "Error al actualizar el administrador" : "Error al crear el administrador");
      }

      handleSave(); // Refrescar la lista de administradores
      handleClose(); // Cerrar modal después de éxito
    } catch (error) {
      setError("No se pudo crear el administrador. Verifica los datos.");
      console.error("Error en la creación:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        {adminData ? "Editar Administrador" : "Agregar Administrador"}
      </DialogTitle>
      <DialogContent>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" name="email" value={admin.email} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="password" label="Contraseña" name="password" value={admin.password} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Nombre" name="firstName" value={admin.firstName} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Apellido" name="lastName" value={admin.lastName} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField fullWidth label="Dirección" name="address" value={admin.address} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Código Postal" name="postalCode" value={admin.postalCode} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Teléfono" name="phoneNumber" value={admin.phoneNumber} onChange={handleChange} required />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField fullWidth type="number" label="Peso (kg)" name="weight" value={admin.weight} onChange={handleChange} required />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField fullWidth type="number" label="Altura (cm)" name="height" value={admin.height} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Objetivo" name="objective" value={admin.objective} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <Input type="file" fullWidth name="profileImage" onChange={handleFileChange} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : adminData ? "Guardar Cambios" : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AdministradorForm;