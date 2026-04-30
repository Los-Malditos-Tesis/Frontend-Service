import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import BusinessIcon from "@mui/icons-material/Business";
import VideocamIcon from "@mui/icons-material/Videocam";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

export const MENU = [
  { name: "Dashboard", path: "/dashboard", icon: <DashboardOutlinedIcon /> },
  { name: "Usuarios", path: "/users", icon: <PeopleAltOutlinedIcon /> },
  { name: "Productos", path: "/products", icon: <Inventory2OutlinedIcon /> },
  { name: "Proveedores", path: "/suppliers", icon: <BusinessIcon /> },
  { name: "Cámaras", path: "/cameras", icon: <VideocamIcon  /> },
  { name: "Ubicaciones", path: "/locations", icon: <LocationOnIcon  /> },
  { name: "Warehouse", path: "/warehouses", icon: <StorageOutlinedIcon /> },
  { name: "Tiendas", path: "/stores", icon: <StorefrontOutlinedIcon /> },
];