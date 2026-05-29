import React from "react";
import { Box, Chip, Divider, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomButton from "../../../components/generic/CustomButton";

const ProductSearchPanel = ({
  query,
  setQuery,
  filteredProducts,
  selectedProduct,
  handleSelectProduct,
  handleSearch,
}) => {
  return (
    <Box
      sx={{
        borderRadius: 4,
        background: "#ffffff",
        border: "1px solid rgba(226,232,240,0.95)",
        boxShadow: "0 18px 45px rgba(15,23,42,0.07)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: { xs: 2.25, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 950,
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                color: "#64748b",
              }}
            >
              Paso 1 - Selecciona el producto
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 950, color: "#0f172a" }}>
              Producto a escanear
            </Typography>
            {/* <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
              Busca por UPC, código, SKU, nombre o categoría.
            </Typography> */}
          </Box>

          <Chip
            label={`${filteredProducts.length} resultados`}
            size="small"
            sx={{ fontWeight: 900, background: "#eef2ff", color: "#284485" }}
          />
        </Box>

        <Box
          sx={{
            mt: 2.5,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              px: 2,
              py: 1.45,
              borderRadius: 3,
              border: "2px solid rgba(226,232,240,0.95)",
              background: "#f8fafc",
              transition: "0.2s ease",
              "&:focus-within": {
                borderColor: "#284485",
                background: "#ffffff",
                boxShadow: "0 0 0 4px rgba(40,68,133,0.08)",
              },
            }}
          >
            <SearchIcon sx={{ color: "#64748b" }} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="Buscar por UPC, código, SKU o nombre..."
              className="w-full border-0 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
            />
          </Box>

          <CustomButton
            className="w-auto! min-w-[120px] px-5! py-3! text-sm!"
            action={handleSearch}
          >
            Buscar
          </CustomButton>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ p: { xs: 2, md: 2.5 }, maxHeight: { xs: 360, lg: 560 }, overflow: "auto" }}>
        {filteredProducts.length === 0 ? (
          <Box
            sx={{
              borderRadius: 3,
              background: "#f8fafc",
              border: "1px solid rgba(226,232,240,0.9)",
              p: 4,
              textAlign: "center",
            }}
          >
            <Inventory2OutlinedIcon sx={{ color: "#94a3b8", fontSize: 46 }} />
            <Typography variant="body2" sx={{ mt: 1, color: "#64748b", fontWeight: 800 }}>
              No se encontraron productos para ese criterio.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gap: 1.35 }}>
            {filteredProducts.map((product) => {
              const isSelected = selectedProduct?.id === product.id;

              return (
                <Box
                  component="button"
                  type="button"
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    border: "1px solid",
                    borderColor: isSelected ? "#284485" : "rgba(226,232,240,0.95)",
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(239,246,255,1) 0%, rgba(255,255,255,1) 100%)"
                      : "#ffffff",
                    borderRadius: 3,
                    p: 2,
                    cursor: "pointer",
                    transition: "0.2s ease",
                    boxShadow: isSelected ? "0 14px 30px rgba(40,68,133,0.12)" : "none",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      borderColor: "#284485",
                      boxShadow: "0 14px 30px rgba(15,23,42,0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: 2.5,
                          display: "grid",
                          placeItems: "center",
                          background: isSelected ? "#dbeafe" : "#f1f5f9",
                          color: isSelected ? "#284485" : "#64748b",
                          flexShrink: 0,
                        }}
                      >
                        <Inventory2OutlinedIcon sx={{ fontSize: 21 }} />
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 950, color: "#0f172a", lineHeight: 1.25 }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                          {product.category || "Sin categoría"} · {product.code || "Sin UPC"} ·{" "}
                          {product.sku || "Sin SKU"}
                        </Typography>
                      </Box>
                    </Box>

                    {isSelected && <CheckCircleIcon sx={{ color: "#2563eb", fontSize: 22 }} />}
                  </Box>

                  {/* <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    <Chip
                      size="small"
                      label={product.category || "Sin categoría"}
                      sx={{ fontWeight: 800 }}
                    />
                    <Chip size="small" variant="outlined" label={`UPC: ${product.code || "--"}`} />
                    <Chip size="small" variant="outlined" label={`SKU: ${product.sku || "--"}`} />
                  </Box> */}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProductSearchPanel;
