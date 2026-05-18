import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const AnalysisPanel = ({ analysis, renderResultIcon, renderStatusCardStyle, renderAnalysisCameraCard, getLocationName }) => {
  return (
    <Box sx={{ borderRadius: 4, background: "#ffffff", border: "1px solid rgba(226,232,240,0.95)", boxShadow: "0 18px 45px rgba(15,23,42,0.07)", p: { xs: 2.25, md: 3 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {renderResultIcon()}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.16em", color: "#64748b" }}>
            Resultado
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 950, color: "#0f172a", lineHeight: 1.1 }}>
            Estado del análisis
          </Typography>
        </Box>
      </Box>

      {analysis ? (
        <Box sx={{ mt: 2, display: "grid", gap: 2 }}>
          <Box sx={{ p: 2.5, borderRadius: 3, border: "1px solid", ...renderStatusCardStyle() }}>
            <Typography variant="h6" sx={{ fontWeight: 950, color: "#0f172a" }}>
              {analysis.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569", mt: 1, fontWeight: 600 }}>
              {analysis.message}
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" }, gap: 1 }}>
            <Box sx={{ borderRadius: 3, background: "#f8fafc", p: 1.5 }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 800 }}>Estado</Typography>
              <Typography variant="body2" sx={{ fontWeight: 950, color: "#0f172a" }}>{analysis.status}</Typography>
            </Box>
            <Box sx={{ borderRadius: 3, background: "#f8fafc", p: 1.5 }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 800 }}>Detectadas</Typography>
              <Typography variant="body2" sx={{ fontWeight: 950, color: "#0f172a" }}>{analysis.matchedCameras?.length || 0}</Typography>
            </Box>
            <Box sx={{ borderRadius: 3, background: "#f8fafc", p: 1.5 }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 800 }}>Respondieron</Typography>
              <Typography variant="body2" sx={{ fontWeight: 950, color: "#0f172a" }}>{analysis.respondedCameras?.length || 0}</Typography>
            </Box>
            <Box sx={{ borderRadius: 3, background: "#f8fafc", p: 1.5 }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 800 }}>Sin respuesta</Typography>
              <Typography variant="body2" sx={{ fontWeight: 950, color: "#0f172a" }}>{analysis.notRespondedCameras?.length || 0}</Typography>
            </Box>
          </Box>

          {analysis.primaryMatch && (
            <Box sx={{ p: 2.5, borderRadius: 3, border: "1px solid rgba(226,232,240,0.95)", background: "#fff" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 950, mb: 1.5, color: "#0f172a" }}>Detección principal</Typography>
              {renderAnalysisCameraCard(analysis.primaryMatch, 0, "matched")}
            </Box>
          )}

          {analysis.matchedCameras?.length > 0 && (
            <Box sx={{ p: 2.5, borderRadius: 3, background: "#f8fafc", border: "1px solid rgba(226,232,240,0.95)" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 950, mb: 1.5, color: "#0f172a" }}>Cámaras con coincidencia</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.25 }}>
                {analysis.matchedCameras.map((entry, index) => renderAnalysisCameraCard(entry, index, "matched"))}
              </Box>
            </Box>
          )}

          {analysis.status === "disordered" && analysis.recommendedLocations?.length > 0 && (
            <Box sx={{ p: 2.5, borderRadius: 3, border: "1px solid rgba(37,99,235,0.18)", background: "rgba(37,99,235,0.04)" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 950, mb: 1, color: "#0f172a" }}>Zonas recomendadas</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {analysis.recommendedLocations.map((location) => (
                  <Chip key={location.id} label={getLocationName(location)} variant="outlined" sx={{ fontWeight: 800 }} />
                ))}
              </Box>
            </Box>
          )}

          {(analysis.respondedCameras?.length > 0 || analysis.notRespondedCameras?.length > 0) && (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.5 }}>
              {analysis.respondedCameras?.length > 0 && (
                <Box sx={{ p: 2.5, borderRadius: 3, background: "#fff", border: "1px solid rgba(226,232,240,0.95)" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 950, mb: 1.5, color: "#0f172a" }}>Cámaras que respondieron</Typography>
                  <Box sx={{ display: "grid", gap: 1 }}>{analysis.respondedCameras.map((entry, index) => renderAnalysisCameraCard(entry, index))}</Box>
                </Box>
              )}

              {analysis.notRespondedCameras?.length > 0 && (
                <Box sx={{ p: 2.5, borderRadius: 3, background: "#fff", border: "1px solid rgba(226,232,240,0.95)" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 950, mb: 1.5, color: "#0f172a" }}>Cámaras sin respuesta</Typography>
                  <Box sx={{ display: "grid", gap: 1 }}>{analysis.notRespondedCameras.map((entry, index) => renderAnalysisCameraCard(entry, index))}</Box>
                </Box>
              )}
            </Box>
          )}

          <Box sx={{ p: 2.5, borderRadius: 3, background: "#f8fafc", border: "1px solid rgba(226,232,240,0.95)" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 950, mb: 1, color: "#0f172a" }}>Trazabilidad</Typography>
            <Typography variant="body2" sx={{ color: "#475569", fontWeight: 700 }}>Categoría analizada: {analysis.productCategory || "--"}</Typography>
            {analysis.scannedAt && <Typography variant="body2" sx={{ color: "#475569", mt: 0.5, fontWeight: 700 }}>Escaneado en: {analysis.scannedAt}</Typography>}
            {analysis.correlationId && <Typography variant="body2" sx={{ color: "#475569", mt: 0.5, fontWeight: 700 }}>Correlation ID: {analysis.correlationId}</Typography>}
          </Box>
        </Box>
      ) : (
        <Box sx={{ mt: 2, borderRadius: 3, background: "#f8fafc", border: "1px solid rgba(226,232,240,0.95)", p: 3.5, textAlign: "center" }}>
          <WarningAmberIcon sx={{ color: "#94a3b8", fontSize: 42 }} />
          <Typography variant="body2" sx={{ mt: 1, color: "#64748b", fontWeight: 800 }}>
            Aquí aparecerá el estado del producto después de consultar las cámaras.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AnalysisPanel;
