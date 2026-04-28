import { NavLink } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import BusinessIcon from "@mui/icons-material/Business";
import VideocamIcon from "@mui/icons-material/Videocam";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
const menu = [
  { name: "Dashboard", path: "/", icon: <DashboardOutlinedIcon /> },
  { name: "Usuarios", path: "/users", icon: <PeopleAltOutlinedIcon /> },
  { name: "Productos", path: "/products", icon: <Inventory2OutlinedIcon /> },
  // Proveedores 
  { name: "Proveedores", path: "/suppliers", icon: <BusinessIcon /> },
  // camera
  { name: "Cámaras", path: "/cameras", icon: <VideocamIcon  /> },
  // ubicaciones
  { name: "Ubicaciones", path: "/locations", icon: <LocationOnIcon  /> },
  { name: "Warehouse", path: "/warehouses", icon: <StorageOutlinedIcon /> },
  { name: "Tiendas", path: "/stores", icon: <StorefrontOutlinedIcon /> },

];

export default function Sidebar({ isBlack = false }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside
      className={`bg-white h-screen w-full max-w-80 flex flex-col border-r-2 border-bordercolor transition-colors duration-300
      ${isBlack ? "bg-black text-white border-gray-800" : "bg-background text-black"}`}
    >
      <div className="px-8 py-8 flex gap-3 items-center mb-6">
        <div className="bg-black p-2 w-10 h-10 flex items-center justify-center">
          <Inventory2OutlinedIcon className="text-white" fontSize="medium" />
        </div>

        <h1 className="text-2xl text-center font-bold">
          Logi
          <span className={isBlack ? "text-white" : "text-accent_color"}>
            Vision
          </span>
        </h1>
      </div>
      <nav className="px-4 flex flex-col gap-2 flex-1">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-4 font-bold rounded-lg transition-all duration-200
              ${isBlack
                ? isActive
                  ? "bg-background text-black"
                  : "text-gray-300 hover:bg-background hover:text-black"
                : isActive
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-black hover:text-white"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className={`mx-8 my-8 flex items-center gap-3 px-4 py-3 mt-4 rounded-lg transition
        ${isBlack
            ? "text-gray-300 hover:bg-red-500 hover:text-white"
            : "text-gray-600 hover:bg-red-500 hover:text-black"
          }`}
      >
        <LogoutIcon />
        Cerrar sesión
      </button>
    </aside>
  );
}