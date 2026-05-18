import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import CustomButton from "../../../components/generic/CustomButton";

const SelectedProductCard = ({ selectedProduct, handleAnalyze }) => {
  return (
    <Box sx={{ borderRadius: 4, background: "#ffffff", border: "1px solid rgba(226,232,240,0.95)", boxShadow: "0 18px 45px rgba(15,23,42,0.07)", p: { xs: 2.25, md: 3 } }}>
      <Typography variant="caption" sx={{ fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.16em", color: "#64748b" }}>
        Producto seleccionado
      </Typography>

      {selectedProduct ? (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ borderRadius: 3, p: 2.25, background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)", border: "1px solid rgba(226,232,240,0.95)" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 950, lineHeight: 1.1, color: "#0f172a" }}>
                  {selectedProduct.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", mt: 0.75, fontWeight: 700 }}>
                  {selectedProduct.code || "--"} · {selectedProduct.sku || "--"}
                </Typography>
              </Box>

              <Chip icon={<Inventory2OutlinedIcon />} label={selectedProduct.category || "Sin categoría"} sx={{ fontWeight: 900, background: "#eef2ff", color: "#284485", maxWidth: 190 }} />
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <CustomButton className="w-full!" action={handleAnalyze} startIcon={<ManageSearchIcon />}>
              Analizar producto
            </CustomButton>
          </Box>
        </Box>
      ) : (
        <Box sx={{ mt: 2, borderRadius: 3, background: "#f8fafc", border: "1px solid rgba(226,232,240,0.9)", p: 3.5, textAlign: "center" }}>
          <Inventory2OutlinedIcon sx={{ color: "#94a3b8", fontSize: 44 }} />
          <Typography variant="body2" sx={{ mt: 1, color: "#64748b", fontWeight: 800 }}>
            Selecciona un producto para iniciar la evaluación.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SelectedProductCard;
