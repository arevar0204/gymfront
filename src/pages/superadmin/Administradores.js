import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit, Add } from "@mui/icons-material";
import LoaderOverlay from "../../components/LoaderOverlay";
import CustomAlert from "../../components/CustomAlert";
import AsignarAdministrador from "../../components/AsignarAdministrador";
import AdministradorForm from "../../components/AdministradorForm";
import { API_URL } from '../../services/api'; // Importa la constante API_URL

function Administradores() {
  const [administradores, setAdministradores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ severity: "", message: "" });
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);

  // 🔹 Obtener administradores desde la API
  const fetchAdministradores = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/Administradores`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Error al obtener administradores");

      const data = await response.json();
      setAdministradores(data);
    } catch (error) {
      console.error(error);
      setAlert({ severity: "error", message: "Error al cargar administradores." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdministradores();
  }, []);

  // 🔹 Abrir modal de creación/edición
  const handleOpenForm = (admin = null) => {
    setSelectedAdmin(admin);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    fetchAdministradores(); // Recargar lista después de cerrar el modal
  };

  // 🔹 Abrir modal de asignación
  const handleOpenAssign = (admin) => {
    setSelectedAdmin(admin);
    setOpenAssign(true);
  };

  // 🔹 Cerrar modal de asignación y recargar lista
  const handleCloseAssign = () => {
    setOpenAssign(false);
    fetchAdministradores(); // Recargar lista después de asignar
  };

  return (
    <Box sx={{ padding: 3 }}>
      {loading && <LoaderOverlay />}
      <CustomAlert severity={alert.severity} message={alert.message} />

      <Typography variant="h4" color="primary">Administradores</Typography>

      <Button variant="contained" color="primary" startIcon={<Add />} sx={{ mt: 2 }} onClick={() => handleOpenForm()}>
        Agregar Administrador
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Gimnasios Asignados</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {administradores.map((admin) => (
              <TableRow key={admin.adminUserId}>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  {admin.assignedGyms.length > 0
                    ? admin.assignedGyms.map((gym) => gym.nombre).join(", ")
                    : "Ninguno"}
                </TableCell>
                <TableCell>
                  <IconButton color="warning" onClick={() => handleOpenForm(admin)}><Edit /></IconButton>
                  <IconButton color="primary" onClick={() => handleOpenAssign(admin)}>+</IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Crear/Editar Administrador */}
      <AdministradorForm 
        open={openForm} 
        handleClose={handleCloseForm} 
        handleSave={fetchAdministradores} 
        adminData={selectedAdmin} 
      />

      {/* Modal de Asignar Administrador a Gimnasio */}
      <AsignarAdministrador 
        open={openAssign} 
        handleClose={handleCloseAssign} 
        handleSave={fetchAdministradores} // 🔹 Ahora actualiza la lista después de asignar
        adminData={selectedAdmin} 
      />
    </Box>
  );
}

export default Administradores;