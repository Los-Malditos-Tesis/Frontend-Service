import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";

const CamerasPanel = ({ previewCameras = [], renderCameraCard, selectedProduct }) => {
  return (
    <Box sx={{ borderRadius: 4, background: "#ffffff", border: "1px solid rgba(226,232,240,0.95)", boxShadow: "0 18px 45px rgba(15,23,42,0.07)", p: { xs: 2.25, md: 3 } }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.16em", color: "#64748b" }}>
            Cámaras a consultar
          </Typography>
          <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 950, color: "#0f172a" }}>
            Ruta de escaneo
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            {selectedProduct
              ? "Se muestran primero las cámaras de la categoría del producto."
              : "Selecciona un producto para priorizar las cámaras por categoría."}
          </Typography>
        </Box>

        <Chip icon={<VideocamIcon />} label={`${previewCameras.length} cámaras`} sx={{ fontWeight: 900 }} />
      </Box>

      <Box sx={{ mt: 2, maxHeight: 280, overflow: "auto", pr: 0.5 }}>
        {previewCameras.length === 0 ? (
          <Box sx={{ borderRadius: 3, background: "#f8fafc", border: "1px solid rgba(226,232,240,0.9)", p: 3, textAlign: "center" }}>
            <VideocamIcon sx={{ color: "#94a3b8", fontSize: 42 }} />
            <Typography variant="body2" sx={{ mt: 1, color: "#64748b", fontWeight: 800 }}>
              No hay cámaras disponibles para mostrar.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr" }, gap: 1.25 }}>
            {previewCameras.map((entry, index) => renderCameraCard(entry, index))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CamerasPanel;
