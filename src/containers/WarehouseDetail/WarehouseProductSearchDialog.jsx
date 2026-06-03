import React, { useMemo, useState } from "react";
import { Box, Chip, Dialog, DialogContent, DialogTitle, IconButton, Slide, Typography } from "@mui/material";
// UI subcomponents moved to smaller files
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PlaceIcon from "@mui/icons-material/Place";
import VideocamIcon from "@mui/icons-material/Videocam";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { runAutomation } from "../../services/automation.service";
import ProductSearchPanel from "./components/ProductSearchPanel";
import SelectedProductCard from "./components/SelectedProductCard";
import CamerasPanel from "./components/CamerasPanel";
import AnalysisPanel from "./components/AnalysisPanel";
import LoadingOverlay from "./components/LoadingOverlay";
import { ENTRY_EXIT_CATEGORY } from "../../utils/conts";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const getProductLabel = (product) =>
  [product?.code, product?.name, product?.sku, product?.category]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const getLocationCategory = (location) =>
  location?.category ?? location?.Category ?? location?.category_name ?? "";

const getLocationName = (location) => location?.zone || location?.name || "Sin zona";

const getCameraCode = (camera) => camera?.code || camera?.cameraCode || camera?.name || "";

const isEntryExitLocation = (location) =>
  normalizeText(getLocationCategory(location)) === normalizeText(ENTRY_EXIT_CATEGORY);

const getLocationCameras = (location) => (Array.isArray(location?.Cameras) ? location.Cameras : []);

const flattenCamerasFromLocations = (locations) =>
  locations.flatMap((location) =>
    getLocationCameras(location)
      .map((camera) => ({
        code: getCameraCode(camera),
        camera,
        location,
      }))
      .filter((entry) => entry.code)
  );

const uniqueCameraCodes = (locations) => [
  ...new Set(flattenCamerasFromLocations(locations).map((item) => item.code)),
];

const resolveMatchedCamera = (entry, cameraIndex) => {
  const code =
    typeof entry === "string" ? entry : entry?.code || entry?.cameraCode || entry?.name || "";
  const resolved = code ? cameraIndex.get(code) : null;

  return {
    code,
    locationName: resolved ? getLocationName(resolved.location) : "Sin ubicación",
    location: resolved?.location || null,
    camera: resolved?.camera || null,
    raw: entry,
  };
};

const buildCameraIndex = (locations) => {
  const index = new Map();

  flattenCamerasFromLocations(locations).forEach((entry) => {
    if (!index.has(entry.code)) {
      index.set(entry.code, entry);
    }
  });

  return index;
};

// Styles are now encapsulated in child components

const WarehouseProductSearchDialog = ({
  open,
  onClose,
  warehouseName,
  products = [],
  locations = [],
}) => {
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loadingStage, setLoadingStage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");

  const searchableLocations = useMemo(
    () => locations.filter((location) => !isEntryExitLocation(location)),
    [locations]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) => getProductLabel(product).includes(normalizedQuery));
  }, [products, query]);

  const previewLocations = useMemo(() => {
    if (!selectedProduct) {
      return locations;
    }

    const productCategory = normalizeText(selectedProduct.category);
    const sameCategoryLocations = locations.filter(
      (location) => normalizeText(getLocationCategory(location)) === productCategory
    );

    return sameCategoryLocations.length > 0 ? sameCategoryLocations : locations;
  }, [locations, selectedProduct]);

  const previewCameras = useMemo(
    () => flattenCamerasFromLocations(previewLocations),
    [previewLocations]
  );

  const handleClose = () => {
    setQuery("");
    setSelectedProduct(null);
    setAnalysis(null);
    setLoadingStage("");
    setLoadingMessage("");
    onClose();
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setAnalysis(null);
  };

  const createAnalysisPayload = async (candidateLocations, label) => {
    const cameraIndex = buildCameraIndex(candidateLocations);
    const cameraCodes = uniqueCameraCodes(candidateLocations);

    if (cameraCodes.length === 0) {
      return { success: false, noCameras: true, message: label };
    }

    setLoadingStage(label);
    setLoadingMessage(
      label === "same"
        ? "Consultando cámaras de la misma categoría..."
        : "Buscando en otras zonas..."
    );

    // Paso 4 y Paso 9: consultar el endpoint con el productId y los códigos de cámaras disponibles.
    const response = await runAutomation({
      productId: selectedProduct.id,
      cameraCodes,
    });

    const responseData = response?.data || {};
    const matched = Array.isArray(responseData?.matchedCameras) ? responseData.matchedCameras : [];
    const responded = Array.isArray(responseData?.respondedCameras)
      ? responseData.respondedCameras
      : [];
    const notResponded = Array.isArray(responseData?.notRespondedCameras)
      ? responseData.notRespondedCameras
      : [];

    const resolvedMatched = matched.map((entry) => resolveMatchedCamera(entry, cameraIndex));
    const resolvedResponded = responded.map((entry) => resolveMatchedCamera(entry, cameraIndex));
    const resolvedNotResponded = notResponded.map((entry) =>
      resolveMatchedCamera(entry, cameraIndex)
    );

    return {
      success: true,
      responseData,
      cameraCodes,
      cameraIndex,
      resolvedMatched,
      resolvedResponded,
      resolvedNotResponded,
    };
  };

  const handleAnalyze = async () => {
    if (!selectedProduct) {
      return;
    }

    try {
      setAnalysis(null);

      // Paso 2: obtener las locations de la misma categoría del producto.
      const productCategory = normalizeText(selectedProduct.category);
      const sameCategoryLocations = searchableLocations.filter(
        (location) => normalizeText(getLocationCategory(location)) === productCategory
      );

      // Paso 3: extraer las cámaras de esas locations.
      const sameCategoryResult = await createAnalysisPayload(sameCategoryLocations, "same");
      console.log("Same category result:", sameCategoryResult);

      if (sameCategoryResult.noCameras) {
        // Si no hay cámaras en la misma categoría, saltamos al siguiente grupo de zonas.
      } else if (sameCategoryResult.success && sameCategoryResult.resolvedMatched.length > 0) {
        const firstMatch = sameCategoryResult.resolvedMatched[0];

        console.log("Producto encontrado en la misma categoría:", firstMatch);

        setAnalysis({
          status: "ordered",
          title: "Producto ordenado",
          tone: "success",
          message: `El producto fue encontrado en la cámara ${firstMatch.code} dentro de la location ${firstMatch.locationName}.`,
          productCategory,
          primaryMatch: firstMatch,
          sameCategoryLocations,
          recommendedLocations: sameCategoryLocations,
          matchedCameras: sameCategoryResult.resolvedMatched,
          respondedCameras: sameCategoryResult.resolvedResponded,
          notRespondedCameras: sameCategoryResult.resolvedNotResponded,
          scannedAt: sameCategoryResult.responseData?.scannedAt,
          correlationId: sameCategoryResult.responseData?.correlationId,
        });

        setLoadingStage("");
        setLoadingMessage("");
        return;
      }

      console.log("No match in same category, checking other zones...");

      // Paso 7 y Paso 8: tomar las zonas que no tienen la misma categoría y sus cámaras.
      const otherLocations = searchableLocations.filter(
        (location) => normalizeText(getLocationCategory(location)) !== productCategory
      );

      console.log("Other locations to check:", otherLocations.length);

      // Paso 10: mostrar el loader mientras se busca en otras zonas.
      const otherZoneResult = await createAnalysisPayload(otherLocations, "other");

      console.log("Other zone result:", otherZoneResult);

      if (otherZoneResult.noCameras) {
        setAnalysis({
          status: "not-found",
          title: "Producto no encontrado",
          tone: "warning",
          message:
            "No hay cámaras disponibles en las zonas alternativas para completar la búsqueda.",
          productCategory,
          primaryMatch: null,
          sameCategoryLocations,
          recommendedLocations: sameCategoryLocations,
          matchedCameras: [],
          respondedCameras: [],
          notRespondedCameras: [],
        });

        setLoadingStage("");
        setLoadingMessage("");
        return;
      }

      console.log("Other zone result:", otherZoneResult);

      if (otherZoneResult.success && otherZoneResult.resolvedMatched.length > 0) {
        const firstMatch = otherZoneResult.resolvedMatched[0];

        // Paso 11: si la detecta fuera de su categoría, se marca como desordenado y se recomiendan las zones correctas.
        setAnalysis({
          status: "disordered",
          title: "Producto desordenado",
          tone: "danger",
          message: `El producto fue detectado en la cámara ${firstMatch.code} dentro de la location ${firstMatch.locationName}, pero esa location no pertenece a su categoría.`,
          productCategory,
          primaryMatch: firstMatch,
          sameCategoryLocations,
          recommendedLocations: sameCategoryLocations,
          matchedCameras: otherZoneResult.resolvedMatched,
          respondedCameras: otherZoneResult.resolvedResponded,
          notRespondedCameras: otherZoneResult.resolvedNotResponded,
          scannedAt: otherZoneResult.responseData?.scannedAt,
          correlationId: otherZoneResult.responseData?.correlationId,
        });
      } else {
        setAnalysis({
          status: "not-found",
          title: "Producto no encontrado",
          tone: "warning",
          message: "No se encontró coincidencia en ninguna de las cámaras consultadas.",
          productCategory,
          primaryMatch: null,
          sameCategoryLocations,
          recommendedLocations: sameCategoryLocations,
          matchedCameras: [],
          respondedCameras: otherZoneResult.resolvedResponded,
          notRespondedCameras: otherZoneResult.resolvedNotResponded,
          scannedAt: otherZoneResult.responseData?.scannedAt,
          correlationId: otherZoneResult.responseData?.correlationId,
        });
      }
    } catch (error) {
      setAnalysis({
        status: "error",
        title: "No fue posible completar la consulta",
        tone: "warning",
        message: error?.message || "Ocurrió un error al consultar las cámaras.",
      });
    } finally {
      setLoadingStage("");
      setLoadingMessage("");
    }
  };

  const handleSearch = () => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
      return;
    }

    const exactMatch = filteredProducts.find(
      (product) => normalizeText(product.code) === normalizedQuery
    );
    const firstMatch = exactMatch || filteredProducts[0] || null;

    if (firstMatch) {
      handleSelectProduct(firstMatch);
    }
  };

  const renderResultIcon = () => {
    if (!analysis) {
      return <RadioButtonUncheckedIcon className="text-slate-400" />;
    }

    if (analysis.status === "ordered") {
      return <CheckCircleIcon className="text-emerald-600" />;
    }

    if (analysis.status === "disordered") {
      return <WarningAmberIcon className="text-amber-600" />;
    }

    return <WarningAmberIcon className="text-slate-500" />;
  };

  const renderStatusCardStyle = () => {
    if (!analysis) {
      return {
        background: "#f8fafc",
        borderColor: "rgba(226,232,240,0.9)",
      };
    }

    if (analysis.tone === "success") {
      return {
        background: "linear-gradient(135deg, rgba(236,253,245,1) 0%, rgba(255,255,255,1) 100%)",
        borderColor: "rgba(16,185,129,0.28)",
      };
    }

    if (analysis.tone === "danger") {
      return {
        background: "linear-gradient(135deg, rgba(255,251,235,1) 0%, rgba(255,255,255,1) 100%)",
        borderColor: "rgba(245,158,11,0.28)",
      };
    }

    return {
      background: "linear-gradient(135deg, rgba(248,250,252,1) 0%, rgba(255,255,255,1) 100%)",
      borderColor: "rgba(148,163,184,0.28)",
    };
  };

  const renderCameraCard = (entry, index, variant = "default") => {
    const isMatched = variant === "matched";
    const isMuted = variant === "muted";

    return (
      <Box
        key={`${entry.code}-${index}`}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: isMatched
            ? "rgba(16,185,129,0.35)"
            : isMuted
              ? "rgba(203,213,225,0.75)"
              : "rgba(226,232,240,0.95)",
          background: isMatched
            ? "rgba(236,253,245,0.9)"
            : isMuted
              ? "rgba(248,250,252,0.85)"
              : "#ffffff",
          p: 2,
          transition: "0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 14px 30px rgba(15,23,42,0.08)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                display: "grid",
                placeItems: "center",
                background: isMatched ? "#dcfce7" : "#eef2ff",
                color: isMatched ? "#059669" : "#284485",
                flexShrink: 0,
              }}
            >
              <VideocamIcon sx={{ fontSize: 20 }} />
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 900, color: "#0f172a", lineHeight: 1.2 }}
              >
                {entry.code}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                {getLocationName(entry.location)}
              </Typography>
            </Box>
          </Box>

          <Chip
            size="small"
            label={isMatched ? "Detectada" : isMuted ? "Sin respuesta" : "A escanear"}
            sx={{
              height: 24,
              fontSize: 11,
              fontWeight: 900,
              borderRadius: 999,
              background: isMatched ? "#bbf7d0" : isMuted ? "#e2e8f0" : "#dbeafe",
              color: isMatched ? "#047857" : isMuted ? "#475569" : "#1d4ed8",
            }}
          />
        </Box>

        <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          <Chip
            size="small"
            variant="outlined"
            icon={<PlaceIcon sx={{ fontSize: "16px !important" }} />}
            label={getLocationName(entry.location)}
            sx={{ fontWeight: 700, maxWidth: "100%" }}
          />
          <Chip
            size="small"
            variant="outlined"
            label={getLocationCategory(entry.location) || "Sin categoría"}
            sx={{ fontWeight: 700, maxWidth: "100%" }}
          />
        </Box>
      </Box>
    );
  };

  const renderAnalysisCameraCard = (entry, index, variant = "default") => (
    <Box
      key={`${entry.code}-${entry.locationName}-${index}`}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: variant === "matched" ? "rgba(16,185,129,0.35)" : "rgba(226,232,240,0.95)",
        background: variant === "matched" ? "rgba(236,253,245,0.9)" : "#ffffff",
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.5,
              display: "grid",
              placeItems: "center",
              background: variant === "matched" ? "#dcfce7" : "#eef2ff",
              color: variant === "matched" ? "#059669" : "#284485",
            }}
          >
            <VideocamIcon sx={{ fontSize: 19 }} />
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#0f172a" }}>
              {entry.code || "Sin código"}
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
              {entry.locationName}
            </Typography>
          </Box>
        </Box>

        {variant === "matched" && <CheckCircleIcon sx={{ color: "#059669", fontSize: 22 }} />}
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          width: "min(1180px, calc(100vw - 32px))",
          maxHeight: "88vh",
          borderRadius: { xs: 3, md: 5 },
          overflow: "hidden",
          background: "#f8fafc",
          boxShadow: "0 30px 90px rgba(15,23,42,0.28)",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(15,23,42,0.48)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 0,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 54%, #284485 100%)",
          color: "white",
        }}
      >
        <Box
          sx={{
            px: { xs: 2.5, md: 4 },
            py: { xs: 2.5, md: 3 },
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                display: { xs: "none", sm: "grid" },
                placeItems: "center",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <ManageSearchIcon />
            </Box>

            <Box>
              <Typography
                variant="overline"
                sx={{ letterSpacing: "0.2em", color: "rgba(255,255,255,0.68)", fontWeight: 900 }}
              >
                Búsqueda inteligente
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 950, lineHeight: 1.1 }}>
                Buscar producto en {warehouseName}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.75, color: "rgba(255,255,255,0.72)" }}>
                Selecciona un producto y consulta las cámaras disponibles por zona.
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={handleClose}
            sx={{
              color: "white",
              width: 42,
              height: 42,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.14)",
              "&:hover": {
                background: "rgba(255,255,255,0.18)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, position: "relative", overflow: "auto" }}>
        <Box sx={{ p: { xs: 2, md: 3.5 } }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.05fr 0.95fr" }, gap: 3 }}>
            <ProductSearchPanel
              query={query}
              setQuery={setQuery}
              filteredProducts={filteredProducts}
              selectedProduct={selectedProduct}
              handleSelectProduct={handleSelectProduct}
              handleSearch={handleSearch}
            />

            <Box sx={{ display: "grid", gap: 3, alignContent: "start" }}>
              <SelectedProductCard selectedProduct={selectedProduct} handleAnalyze={handleAnalyze} />

              {/* <CamerasPanel previewCameras={previewCameras} renderCameraCard={renderCameraCard} selectedProduct={selectedProduct} /> */}

              <AnalysisPanel
                analysis={analysis}
                renderResultIcon={renderResultIcon}
                renderStatusCardStyle={renderStatusCardStyle}
                renderAnalysisCameraCard={renderAnalysisCameraCard}
                getLocationName={getLocationName}
              />
            </Box>
          </Box>

          {loadingStage && <LoadingOverlay loadingStage={loadingStage} loadingMessage={loadingMessage} />}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WarehouseProductSearchDialog;
