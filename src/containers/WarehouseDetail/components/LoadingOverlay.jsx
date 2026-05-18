import React from "react";
import { Box, Chip, Typography, CircularProgress } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";

const LoadingOverlay = ({ loadingStage, loadingMessage }) => {
  return (
    <Box sx={{ position: "fixed", inset: 0, zIndex: 1400, display: "grid", placeItems: "center", background: "rgba(15,23,42,0.45)", backdropFilter: "blur(10px)" }}>
      <Box sx={{ width: "min(92vw, 440px)", borderRadius: 5, background: "rgba(255,255,255,0.98)", border: "1px solid rgba(226,232,240,0.95)", boxShadow: "0 30px 80px rgba(15,23,42,0.28)", p: 4, textAlign: "center" }}>
        <Box sx={{ mx: "auto", mb: 2, width: 92, height: 92, borderRadius: "50%", display: "grid", placeItems: "center", background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)", border: "1px solid rgba(37,99,235,0.16)" }}>
          <CircularProgress size={58} sx={{ color: "#284485" }} />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 950, color: "#0f172a" }}>{loadingMessage}</Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mt: 1, fontWeight: 600 }}>Estamos consultando las cámaras asignadas para validar la ubicación del producto.</Typography>

        <Box sx={{ mt: 2.5, display: "flex", justifyContent: "center", gap: 1 }}>
          <Chip icon={<VideocamIcon />} label={loadingStage === "same" ? "Categoría principal" : "Zonas alternativas"} sx={{ fontWeight: 900 }} />
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingOverlay;
