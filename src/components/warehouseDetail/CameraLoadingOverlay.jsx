import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";

export default function CameraLoadingOverlay({
  open,
  message = "Obteniendo imágenes de las cámaras",
}) {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        display: "grid",
        placeItems: "center",
        background: "rgba(2, 6, 23, 0.55)",
        backdropFilter: "blur(8px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.98 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Box
          sx={{
            width: "min(92vw, 440px)",
            borderRadius: "22px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 24px 70px rgba(2, 6, 23, 0.30)",
            p: 3.5,
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "14px",
                display: "grid",
                placeItems: "center",
                background: "#eff6ff",
                color: "#2563eb",
              }}
            >
              <CameraAltRoundedIcon />
            </Box>

            <Box sx={{ textAlign: "left" }}>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: 1.2,
                }}
              >
                Consultando cámaras
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: "#64748b",
                  mt: 0.3,
                }}
              >
                Solicitando imágenes en tiempo real
              </Typography>
            </Box>
          </Box>

          {/* Visual profesional */}
          <Box
            sx={{
              height: 150,
              borderRadius: "18px",
              background:
                "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
              border: "1px solid #e2e8f0",
              position: "relative",
              overflow: "hidden",
              mb: 3,
            }}
          >
            {/* Grid sutil */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                opacity: 0.45,
              }}
            />

            {/* Línea de escaneo */}
            <motion.div
              animate={{ x: ["-20%", "120%"] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "34%",
                background:
                  "linear-gradient(90deg, transparent, rgba(37,99,235,0.16), transparent)",
              }}
            />

            {/* Nodo central */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.04, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Box
                  sx={{
                    width: 62,
                    height: 62,
                    borderRadius: "18px",
                    display: "grid",
                    placeItems: "center",
                    background: "#2563eb",
                    color: "#ffffff",
                    boxShadow: "0 14px 32px rgba(37,99,235,0.28)",
                  }}
                >
                  <HubRoundedIcon sx={{ fontSize: 32 }} />
                </Box>
              </motion.div>
            </Box>

            {/* Cámaras/nodos */}
            {[
              { top: 26, left: 44, delay: 0 },
              { top: 28, right: 48, delay: 0.2 },
              { bottom: 26, left: 74, delay: 0.4 },
              { bottom: 28, right: 78, delay: 0.6 },
            ].map((item, index) => (
              <motion.div
                key={index}
                animate={{
                  opacity: [0.45, 1, 0.45],
                  scale: [0.96, 1, 0.96],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: item.delay,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  ...item,
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "13px",
                    display: "grid",
                    placeItems: "center",
                    background: "#ffffff",
                    color: "#2563eb",
                    border: "1px solid #cbd5e1",
                    boxShadow: "0 8px 18px rgba(15,23,42,0.08)",
                  }}
                >
                  <CameraAltRoundedIcon sx={{ fontSize: 20 }} />
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Loader + texto */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CircularProgress
              size={34}
              thickness={4}
              sx={{ color: "#2563eb" }}
            />

            <Box sx={{ textAlign: "left", flex: 1 }}>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                {message}
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: "#64748b",
                  mt: 0.4,
                }}
              >
                Esto puede tardar unos segundos mientras las cámaras responden.
              </Typography>
            </Box>
          </Box>

          {/* Barra inferior */}
          <Box
            sx={{
              mt: 3,
              height: 4,
              borderRadius: 999,
              background: "#e2e8f0",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ x: ["-45%", "140%"] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                height: "100%",
                width: "42%",
                borderRadius: 999,
                background: "#2563eb",
              }}
            />
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}