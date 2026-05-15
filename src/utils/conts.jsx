import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import BusinessIcon from "@mui/icons-material/Business";
import VideocamIcon from "@mui/icons-material/Videocam";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";

export const ROLES = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
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

export const MENU = [
  { name: "Dashboard", path: "/dashboard", icon: <DashboardOutlinedIcon /> },
  { name: "Proveedores", path: "/suppliers", icon: <BusinessIcon /> },
  { name: "Warehouse", path: "/warehouses", icon: <StorageOutlinedIcon /> },
  { name: "Órdenes", path: "/orders", icon: <ReceiptLongOutlinedIcon /> },
  { name: "Escaneos", path: "/scans", icon: <QrCodeScannerOutlinedIcon /> },
  { name: "Tiendas", path: "/stores", icon: <StorefrontOutlinedIcon /> },

  { name: "Productos", path: "/products", icon: <Inventory2OutlinedIcon /> },
  { name: "Usuarios", path: "/users", icon: <PeopleAltOutlinedIcon /> },
  { name: "Cámaras", path: "/cameras", icon: <VideocamIcon /> },
  { name: "Ubicaciones", path: "/locations", icon: <LocationOnIcon /> },
  { name: "API Test", path: "/api-test", icon: <ScienceOutlinedIcon /> },
];