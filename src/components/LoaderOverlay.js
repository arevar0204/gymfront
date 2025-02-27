// /src/components/LoaderOverlay.js
import { Box, CircularProgress } from "@mui/material";

function LoaderOverlay() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
}

export default LoaderOverlay;