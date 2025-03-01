import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Button
} from "@mui/material";
import LoaderOverlay from "../../components/LoaderOverlay"; // Ajusta si tu proyecto lo usa

// URL fija del Hub
const HUB_URL = "https://localhost:7113/hubeventos";

function HikvisionEvents() {
  const [connection, setConnection] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Conectando a SignalR...");
  const [gymId, setGymId] = useState("1"); // Por defecto, Gimnasio 1
  const [latestEvent, setLatestEvent] = useState(null); // Evento actual (tarjeta)
  const [historyEvents, setHistoryEvents] = useState([]); // Historial (máx 30)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Crear conexión
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();

    // Iniciar la conexión
    newConnection.start()
      .then(() => {
        setConnectionStatus("Conexión establecida (pero sin unirse a un gimnasio)");
        setConnection(newConnection);
        // Quitar pantalla de carga tras 2s
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      })
      .catch(err => {
        console.error("Error al conectar SignalR:", err);
        setConnectionStatus("Error al conectar (ver consola)");
        setIsLoading(false);
      });

    // Escuchar ReceiveEvent
    newConnection.on("ReceiveEvent", data => {
      console.log("Evento Hikvision (SignalR):", data);

      // Actualizar la tarjeta
      setLatestEvent(data);

      // Agregar al principio del historial
      setHistoryEvents(prev => {
        const newArr = [data, ...prev];
        if (newArr.length > 30) newArr.pop();
        return newArr;
      });
    });

    return () => {
      newConnection.stop();
    };
  }, []);

  // Unirse a un grupo de gym
  const handleJoinGymGroup = async () => {
    if (!connection) return;
    try {
      await connection.invoke("JoinGymGroup", parseInt(gymId, 10));
      setConnectionStatus(`Unido a Gym_${gymId}`);
      console.log(`Unido al grupo Gym_${gymId}`);
    } catch (err) {
      console.error("Error al unirse:", err);
    }
  };

  // Formatear fecha/hora
  function formatearFechaHora(isoString) {
    if (!isoString) return { fecha: "(sin fecha)", hora: "--:--:--" };
    const dateObj = new Date(isoString);
    const fecha = dateObj.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const hora = dateObj.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return { fecha, hora };
  }

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#f7f7f7",
        minHeight: "100vh"
      }}
    >
      {isLoading && <LoaderOverlay />}

      {/* Columna Izquierda */}
      <Box sx={{ flex: 1, mr: 2 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Eventos Hikvision (SignalR)
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Estado: {connectionStatus}
        </Typography>

        {/* Seleccionar gymId */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <TextField
            label="Gym ID"
            variant="outlined"
            size="small"
            value={gymId}
            onChange={(e) => setGymId(e.target.value)}
            sx={{ width: 100 }}
          />
          <Button variant="contained" onClick={handleJoinGymGroup}>
            Unirse
          </Button>
        </Box>

        <Card
          sx={{
            width: "100%",
            minHeight: 250,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 4,
            mb: 4,
          }}
        >
          {/* Tarjeta del último evento */}
          {latestEvent ? (
            <TarjetaEvento data={latestEvent} formatearFechaHora={formatearFechaHora} />
          ) : (
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Esperando evento...
              </Typography>
            </CardContent>
          )}
        </Card>
      </Box>

      {/* Columna Derecha: Historial */}
      <Box sx={{ flex: 2 }}>
        {historyEvents.length > 0 && (
          <Paper sx={{ p: 2, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom>
              Historial (máx 30)
            </Typography>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "primary.main" }}>
                  <TableCell sx={{ color: "white" }}>Fecha</TableCell>
                  <TableCell sx={{ color: "white" }}>Hora</TableCell>
                  <TableCell sx={{ color: "white" }}>Nombre</TableCell>
                  <TableCell sx={{ color: "white" }}>Puerta</TableCell>
                  <TableCell sx={{ color: "white" }}>Máscara</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyEvents.map((ev, idx) => {
                  const { event, profile } = ev;
                  const fechaObj = formatearFechaHora(event?.eventDate);
                  const name = profile
                    ? `${profile.firstName} ${profile.lastName}`
                    : "Desconocido";
                  const doorNo = event?.doorNumber || "?";
                  const mask = event?.maskStatus || "desconocido";

                  return (
                    <TableRow key={idx}>
                      <TableCell>{fechaObj.fecha}</TableCell>
                      <TableCell>{fechaObj.hora}</TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{doorNo}</TableCell>
                      <TableCell>{mask}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

// TarjetaEvento con foto (mapping.hikvisionPhotoUrl)
function TarjetaEvento({ data, formatearFechaHora }) {
  const { event, mapping, profile } = data;
  const fechaObj = formatearFechaHora(event?.eventDate);
  const doorNo = event?.doorNumber || "?";
  const mask = event?.maskStatus || "desconocido";

  // Nombre
  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : "Sin nombre";

  // Foto
  const foto = mapping?.hikvisionPhotoUrl;

  return (
    <Box sx={{ display: "flex" }}>
      <CardContent sx={{ flex: "1 1 auto" }}>
        <Typography variant="h6" gutterBottom>
          {fechaObj.fecha} - {fechaObj.hora}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Empleado:</strong> {fullName}
        </Typography>
        <Typography variant="body1">
          <strong>Puerta:</strong> {doorNo}
        </Typography>
        <Typography variant="body1">
          <strong>Máscara:</strong> {mask}
        </Typography>
      </CardContent>

      {foto && (
        <Box
          sx={{
            width: 180,
            height: 180,
            overflow: "hidden",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ececec",
            m: 2,
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: "100%", height: "auto" }}
            image={foto}
            alt="Foto Acceso"
          />
        </Box>
      )}
    </Box>
  );
}

export default HikvisionEvents;