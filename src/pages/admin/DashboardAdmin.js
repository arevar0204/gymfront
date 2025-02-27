// /src/pages/admin/DashboardAdmin.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importar componentes de Recharts
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

function DashboardAdmin() {
  const [daily30, setDaily30] = useState([]); // Datos últimos 30 días
  const [dailyAll, setDailyAll] = useState([]); // Datos de todo el tiempo
  const navigate = useNavigate();

  // Función para formatear la fecha en el eje X (ej: "25/02")
  const formatDate = (isoDateString) => {
    const dateObj = new Date(isoDateString);
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  // Consumir la API de los últimos 30 días
  const fetchDaily30 = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Si no hay token, redirigir a login o manejar el error
        console.error('No hay token, redirigiendo...');
        navigate('/login');
        return;
      }

      const response = await fetch('https://localhost:7113/api/Auth/daily-registrations-30', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener registros de últimos 30 días');
      }

      const data = await response.json();
      // data es un array como [{ date: "2025-02-20T00:00:00", count: 1 }, ...]
      // Convertimos date a algo más usable o lo formateamos en la gráfica
      setDaily30(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Consumir la API de todos los tiempos
  const fetchDailyAll = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No hay token, redirigiendo...');
        navigate('/login');
        return;
      }

      const response = await fetch('https://localhost:7113/api/Auth/daily-registrations-all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener registros de todo el historial');
      }

      const data = await response.json();
      // data es un array como [{ date: "2025-01-22T00:00:00", count: 1 }, ...]
      setDailyAll(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Llamamos las APIs al montar el componente
  useEffect(() => {
    fetchDaily30();
    fetchDailyAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Dashboard Administrador</h2>
      <p>Bienvenido al panel de administración.</p>

      <div style={{ marginTop: '2rem' }}>
        <h3>Registros de los Últimos 30 Días</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={daily30}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* Eje X con formateo de fecha */}
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => `Fecha: ${formatDate(label)}`}
              formatter={(value) => [`${value} registros`, 'Count']}
            />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Registros de Todos los Tiempos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dailyAll}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => `Fecha: ${formatDate(label)}`}
              formatter={(value) => [`${value} registros`, 'Count']}
            />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DashboardAdmin;