import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  TablePagination,
  IconButton,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import LoaderOverlay from "../../components/LoaderOverlay";
import CustomAlert from "../../components/CustomAlert";
import GimnasioForm from "../../components/GimnasioForm";
import GimnasioDeleteDialog from "../../components/GimnasioDeleteDialog";
import { API_URL } from '../../services/api'; // Importa la constante API_URL

function Gimnasios() {
  const navigate = useNavigate();
  const [gimnasios, setGimnasios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ severity: "", message: "" });
  const [rowsPerPage, setRowsPerPage] = useState(10); // Control de cantidad de gimnasios mostrados
  const [page, setPage] = useState(0); // Página actual
  const [selectedGimnasio, setSelectedGimnasio] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Obtener gimnasios desde la API
  const fetchGimnasios = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const response = await fetch(`${API_URL}/Gimnacios`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "text/plain" },
      });

      if (!response.ok) throw new Error("Error al obtener gimnasios");

      const data = await response.json();
      setGimnasios(data);
    } catch (error) {
      console.error(error);
      setAlert({ severity: "error", message: "No se pudieron cargar los gimnasios" });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchGimnasios();
  }, [fetchGimnasios]);

  // Abrir modal para crear/editar gimnasio
  const handleOpenForm = (gimnasio = null) => {
    setSelectedGimnasio(gimnasio);
    setOpenForm(true);
  };

  const handleCloseForm = () => setOpenForm(false);

  // Abrir modal de eliminación
  const handleOpenDelete = (gimnasio) => {
    setSelectedGimnasio(gimnasio);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => setOpenDeleteDialog(false);

  // Manejar eliminación de gimnasio
  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/Gimnacios/${selectedGimnasio.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "text/plain" },
      });

      if (!response.ok) throw new Error("Error al eliminar gimnasio");

      setAlert({ severity: "success", message: "Gimnasio eliminado con éxito." });
      fetchGimnasios(); // Recargar gimnasios después de eliminar
    } catch (error) {
      console.error(error);
      setAlert({ severity: "error", message: "Error al eliminar gimnasio." });
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  // Control de cambio de página en la tabla
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Control de cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Resetear a la primera página
  };

  return (
    <Box sx={{ padding: 3 }}>
      {loading && <LoaderOverlay />}
      <CustomAlert severity={alert.severity} message={alert.message} />

      <Typography variant="h4" color="primary">
        Gimnasios
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        sx={{ mt: 2, mb: 2 }}
        onClick={() => handleOpenForm()}
      >
        Agregar Gimnasio
      </Button>

      {/* Tabla de gimnasios */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Ubicación</strong></TableCell>
              <TableCell><strong>Clientes</strong></TableCell>
              <TableCell><strong>Administradores</strong></TableCell>
              <TableCell><strong>Vigilantes</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gimnasios
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((gym) => (
                <TableRow key={gym.id}>
                  <TableCell>{gym.nombre}</TableCell>
                  <TableCell>{gym.ciudad}, {gym.estado}</TableCell>
                  <TableCell>{gym.numeroClientesPermitidos}</TableCell>
                  <TableCell>{gym.numeroAdministradoresPermitidos}</TableCell>
                  <TableCell>{gym.numeroVigilantesPermitidos}</TableCell>
                  <TableCell>
                    <IconButton color="warning" onClick={() => handleOpenForm(gym)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleOpenDelete(gym)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        rowsPerPageOptions={[10, 30, 60, 100]}
        component="div"
        count={gimnasios.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modales */}
      <GimnasioForm
        open={openForm}
        handleClose={handleCloseForm}
        handleSave={fetchGimnasios}
        gimnasioData={selectedGimnasio}
      />
      <GimnasioDeleteDialog
        open={openDeleteDialog}
        handleClose={handleCloseDelete}
        handleDelete={handleDelete}
      />
    </Box>
  );
}

export default Gimnasios;