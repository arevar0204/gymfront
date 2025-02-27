import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Box,
  Select,
  MenuItem,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SecurityIcon from '@mui/icons-material/Security';
import { API_URL } from '../../services/api'; // Importa la constante API_URL

function DashboardSuperAdmin() {
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [gimnasios, setGimnasios] = useState([]);
  const [interval, setInterval] = useState("all");
  const navigate = useNavigate();

  const formatDate = (isoDateString) => {
    return new Date(isoDateString).toISOString().split("T")[0];
  };

  const getEndpoint = useCallback((interval) => {
    return interval === "30"
      ? `${API_URL}/Auth/daily-registrations-30`
      : `${API_URL}/Auth/daily-registrations-all`;
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(getEndpoint(interval), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al obtener datos");

      const data = await response.json();
      setLineData(data);
      setBarData(data);
    } catch (error) {
      console.error(error);
    }
  }, [getEndpoint, interval, navigate]);

  const fetchGimnasios = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/Gimnacios`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "text/plain" },
      });

      if (!response.ok) throw new Error("Error al obtener gimnasios");

      const data = await response.json();
      setGimnasios(data);
    } catch (error) {
      console.error(error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
    fetchGimnasios();
  }, [fetchData, fetchGimnasios]);

  return (
    <div style={{ padding: "1rem", marginTop: "-20px" }}>
      <h2 style={{ color: "#1E3C72", textAlign: "center" }}>Bienvenido SuperAdmin</h2>

      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <Select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          variant="outlined"
          size="small"
        >
          <MenuItem value="30">Últimos 30 días</MenuItem>
          <MenuItem value="all">Todo el historial</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2, backgroundColor: "#E8F0FF", borderRadius: 3 }}>
            <Typography variant="h6" color="primary" textAlign="center">
              Registros de Usuarios
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={lineData}>
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis allowDecimals={false} />
                <Tooltip labelFormatter={(label) => `Fecha: ${formatDate(label)}`} />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#FF6347" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2, backgroundColor: "#E8F0FF", borderRadius: 3 }}>
            <Typography variant="h6" color="primary" textAlign="center">
              Registros de Usuarios (Últimos 30 días)
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis allowDecimals={false} />
                <Tooltip labelFormatter={(label) => `Fecha: ${formatDate(label)}`} />
                <Legend />
                <Bar dataKey="count" fill="#FFA500" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      <h2 style={{ marginTop: "1rem", color: "#1E3C72" }}>Gimnasios</h2>
      <Grid container spacing={2} sx={{ overflowY: "auto", maxHeight: "500px", padding: 2 }}>
        {gimnasios.map((gym) => (
          <Grid item xs={12} sm={6} md={4} key={gym.id}>
            <Card sx={{ maxWidth: 250, background: "#F8F9FB", borderRadius: 3, padding: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 70, height: 70, borderRadius: "50%", border: "3px solid white" }}
                  image={gym.fotoPerfilUrl ? gym.fotoPerfilUrl : "/images/gym-placeholder.jpg"}
                  alt={gym.nombre}
                />
              </Box>
              <CardContent>
                <Typography variant="h6" textAlign="center">{gym.nombre}</Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {gym.calle} #{gym.numeroExterior}, {gym.ciudad}, {gym.estado}, CP {gym.codigoPostal}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-around", mt: 1 }}>
                  <PeopleIcon sx={{ color: "#1E3C72" }} />
                  <Typography variant="body2">{gym.numeroClientesPermitidos}</Typography>
                  <AdminPanelSettingsIcon sx={{ color: "#1E3C72" }} />
                  <Typography variant="body2">{gym.numeroAdministradoresPermitidos}</Typography>
                  <SecurityIcon sx={{ color: "#1E3C72" }} />
                  <Typography variant="body2">{gym.numeroVigilantesPermitidos}</Typography>
                </Box>
              </CardContent>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1, paddingBottom: 1 }}>
                <IconButton color="primary"><VisibilityIcon /></IconButton>
                <IconButton color="warning"><EditIcon /></IconButton>
                <IconButton color="error"><DeleteIcon /></IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default DashboardSuperAdmin;