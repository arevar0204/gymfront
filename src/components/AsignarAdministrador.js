import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { API_URL } from '../services/api'; // Importa la constante API_URL

function AsignarAdministrador({ open, handleClose, handleSave = () => {}, adminData }) {
  const [gimnasios, setGimnasios] = useState([]);
  const [selectedGym, setSelectedGym] = useState("");
  const [loading, setLoading] = useState(false); // Para mostrar carga en botón

  useEffect(() => {
    const fetchGimnasios = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_URL}/Gimnacios`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });

        if (!response.ok) throw new Error("Error al obtener gimnasios");

        const data = await response.json();
        setGimnasios(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGimnasios();
  }, []);

  const handleAssign = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/Administradores/asignar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminUserId: adminData.adminUserId,
          gimnacioId: parseInt(selectedGym),
        }),
      });

      if (!response.ok) throw new Error("Error al asignar administrador");

      // 🔹 Llamamos a handleSave para actualizar la lista sin recargar manualmente
      handleSave();  

      // 🔹 Cierra el modal automáticamente al asignar
      handleClose(); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Asignar Gimnasio a {adminData?.email}</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Selecciona un gimnasio"
          fullWidth
          value={selectedGym}
          onChange={(e) => setSelectedGym(e.target.value)}
          variant="outlined"
          margin="normal"
        >
          {gimnasios.map((gym) => (
            <MenuItem key={gym.id} value={gym.id}>
              {gym.nombre}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancelar</Button>
        <Button 
          onClick={handleAssign} 
          color="primary" 
          variant="contained" 
          disabled={!selectedGym || loading} // Deshabilita si está cargando
        >
          {loading ? "Asignando..." : "Asignar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AsignarAdministrador;