import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import { API_URL } from "../../services/api"; // Ajusta tu import
import LoaderOverlay from "../../components/LoaderOverlay"; // Importa el componente LoaderOverlay

function HikvisionEvents() {
  const [sseStatus, setSseStatus] = useState("Conectando SSE...");
  const [latestEvent, setLatestEvent] = useState(null); // Evento actual en la tarjeta
  const [historyEvents, setHistoryEvents] = useState([]); // Array de eventos (máx 30)
  const [isLoading, setIsLoading] = useState(true); // Estado para la pantalla de carga

  // Referencia para almacenar un posible timeout (si llega otro evento antes de 3s)
  const timeoutRef = useRef(null);

  useEffect(() => {
    const es = new EventSource(`${API_URL}/hikvision/events`);

    es.onopen = () => {
      setSseStatus("Conexión SSE establecida");
      setTimeout(() => {
        setIsLoading(false); // Ocultar pantalla de carga después de 3 segundos
      }, 3000);
    };

    es.onerror = (err) => {
      console.error("Error SSE:", err);
      setSseStatus("Error SSE (ver consola)");
      setIsLoading(false); // Ocultar pantalla de carga en caso de error
    };

    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);

        if (parsed.error) {
          console.error("Error SSE:", parsed);
          setSseStatus(`Error SSE: ${parsed.detail || ""}`);
          return;
        }
        if (parsed.info) {
          setSseStatus(parsed.info);
          return;
        }
        if (parsed.chunk) {
          const eventObj = extraerJsonDelChunk(parsed.chunk);
          if (!eventObj) return;

          const alert = eventObj.EventNotificationAlert;
          const ace = alert?.AccessControllerEvent;
          if (!ace) return;

          const empNo = ace.employeeNo || "N/A";
          if (empNo === "N/A") return; // ignorar

          // Cancelar timeout anterior, si existía
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Asignar este evento a la tarjeta
          setLatestEvent(eventObj);

          // Después de 3 segundos, moverlo al historial
          timeoutRef.current = setTimeout(() => {
            setHistoryEvents((prev) => {
              const newArr = [eventObj, ...prev];
              // Limitar a 30
              if (newArr.length > 30) newArr.pop();
              return newArr;
            });
            setLatestEvent(null); // limpiar la tarjeta
          }, 3000);
        }
      } catch (ex) {
        console.warn("No se pudo parsear SSE data:", ex);
      }
    };

    return () => {
      es.close();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function extraerJsonDelChunk(chunkStr) {
    const sep = "\r\n\r\n";
    const idx = chunkStr.indexOf(sep);
    if (idx === -1) return null;

    let rawJson = chunkStr.substring(idx + sep.length).trim();
    rawJson = rawJson.replace(/\r?\n$/, "");

    try {
      return JSON.parse(rawJson);
    } catch {
      return null;
    }
  }

  // Función para formatear la fecha/hora: "dd/mm/yyyy" y "hh:mm:ss"
  function formatearFechaHora(isoString) {
    if (!isoString) return { fecha: "(sin fecha)", hora: "" };
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
    <Box sx={{ p: 3, display: "flex", flexDirection: "row" }}>
      {isLoading && <LoaderOverlay />} {/* Mostrar LoaderOverlay si isLoading es true */}

      {/* Columna Izquierda: Tarjeta de Evento */}
      <Box sx={{ flex: 1, mr: 2 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Eventos Hikvision
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Estado SSE: {sseStatus}
        </Typography>

        <Card sx={{ width: "100%", mb: 4 }}>
          {latestEvent ? (
            <TarjetaEvento
              evento={latestEvent}
              formatearFechaHora={formatearFechaHora}
            />
          ) : (
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 150,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No hay evento en curso
              </Typography>
            </CardContent>
          )}
        </Card>
      </Box>

      {/* Columna Derecha: Historial de Eventos */}
      <Box sx={{ flex: 2 }}>
        {historyEvents.length > 0 && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Historial de Eventos (máx 30)
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Empleado</TableCell>
                  <TableCell>Puerta</TableCell>
                  <TableCell>Máscara</TableCell>
                  <TableCell>Foto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyEvents.map((evt, idx) => {
                  const alert = evt.EventNotificationAlert;
                  const ace = alert.AccessControllerEvent;
                  const { fecha, hora } = formatearFechaHora(alert.dateTime);
                  const empNo = ace.employeeNo;
                  const doorNo = ace.doorNo || "?";
                  const mask = ace.mask || "desconocido";
                  const pictureURL = ace.pictureURL
                    ? `${API_URL}/hikvision/pic-proxy?path=${encodeURIComponent(
                        ace.pictureURL
                      )}`
                    : null;

                  return (
                    <TableRow key={idx}>
                      <TableCell>{fecha}</TableCell>
                      <TableCell>{hora}</TableCell>
                      <TableCell>{empNo}</TableCell>
                      <TableCell>{doorNo}</TableCell>
                      <TableCell>{mask}</TableCell>
                      <TableCell>
                        {pictureURL && (
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              overflow: "hidden",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#f0f0f0",
                            }}
                          >
                            <img
                              src={pictureURL}
                              alt="Foto Acceso"
                              style={{ width: "100%", height: "auto" }}
                            />
                          </Box>
                        )}
                      </TableCell>
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

// Componente que muestra la info del evento
function TarjetaEvento({ evento, formatearFechaHora }) {
  const alert = evento.EventNotificationAlert;
  const ace = alert.AccessControllerEvent;
  const { fecha, hora } = formatearFechaHora(alert.dateTime);
  const empNo = ace.employeeNo;
  const doorNo = ace.doorNo || "?";
  const mask = ace.mask || "desconocido";
  const pictureURL = ace.pictureURL
    ? `${API_URL}/hikvision/pic-proxy?path=${encodeURIComponent(ace.pictureURL)}`
    : null;

  return (
    <Box sx={{ display: "flex" }}>
      {/* Info a la izquierda */}
      <CardContent sx={{ flex: "1 1 auto" }}>
        <Typography variant="h6" gutterBottom>
          {fecha}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {hora}
        </Typography>
        <Typography variant="body1">
          <strong>Empleado:</strong> {empNo}
        </Typography>
        <Typography variant="body1">
          <strong>Puerta:</strong> {doorNo}
        </Typography>
        <Typography variant="body1">
          <strong>Máscara:</strong> {mask}
        </Typography>
      </CardContent>

      {/* Foto a la derecha */}
      {pictureURL && (
        <Box
          sx={{
            width: 180,
            height: 180,
            overflow: "hidden",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: "100%", height: "auto" }}
            image={pictureURL}
            alt="Foto Acceso"
          />
        </Box>
      )}
    </Box>
  );
}

export default HikvisionEvents;