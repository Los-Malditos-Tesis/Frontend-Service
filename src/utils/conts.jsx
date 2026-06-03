import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import BusinessIcon from "@mui/icons-material/Business";
import VideocamIcon from "@mui/icons-material/Videocam";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";

export const CATEGORIES = [
  { value: "Electrónica", label: "Electrónica" },
  { value: "Audio y Video", label: "Audio y Video" },
  { value: "Gaming", label: "Gaming" },
  { value: "Equipo de computo", label: "Equipo de computo" },
  { value: "Periféricos", label: "Periféricos" },
  { value: "Muelle de Entrada y Salida", label: "Muelle de Entrada y Salida" },
];

export const ENTRY_EXIT_CATEGORY = "Muelle de Entrada y Salida";

export const ROLES = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  VIEWER: "VIEWER",
  VIEWER_ORDER: "VIEWER-ORDER",
  USER: "USER",
};

export const ORDER_TYPES = {
  SALE: "SALE",
  TRANSFER: "TRANSFER",
};

export const ORDER_UNIT_TYPES = {
  PALLET: "PAL",
  BOX: "BOX",
};

export const ORDER_STATUS = {
  PENDING: "PENDING",
  // SHIPPED: "SHIPPED",
  DISPATCHED: "DISPATCHED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

export const ROUTES = [
  { name: "Dashboard", path: "/dashboard", icon: <DashboardOutlinedIcon /> },
  { name: "Proveedores", path: "/suppliers", icon: <BusinessIcon /> },
  { name: "Tiendas", path: "/stores", icon: <StorefrontOutlinedIcon /> },
  { name: "Bodegas", path: "/warehouses", icon: <StorageOutlinedIcon /> },
  { name: "Zonas", path: "/locations", icon: <LocationOnIcon /> },
  { name: "Cámaras", path: "/cameras", icon: <VideocamIcon /> },
  { name: "Productos", path: "/products", icon: <Inventory2OutlinedIcon /> },
  { name: "Órdenes", path: "/orders", icon: <ReceiptLongOutlinedIcon /> },
  { name: "Escaneos", path: "/scans", icon: <QrCodeScannerOutlinedIcon /> },
  { name: "Usuarios", path: "/users", icon: <PeopleAltOutlinedIcon /> },
  // { name: "API Test", path: "/api-test", icon: <ScienceOutlinedIcon /> },
];
