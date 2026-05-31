import { NavLink } from "react-router-dom";
import { MENU, ROLES } from "../../utils/conts.jsx";
import LogoutIcon from "@mui/icons-material/Logout";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useAuth } from "../../context/AuthContext.jsx";
import { hasAnyRole } from "../../utils/accessControl.js";
import { useState } from "react";
import { useEffect } from "react";

export default function Sidebar({ isBlack = false }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  const [filteredMenu, setFilteredMenu] = useState(MENU);

  const { user } = useAuth();
  const canManage = hasAnyRole(user, [ROLES.SUPERADMIN]);

  useEffect(() => {
    if (canManage) {
      setFilteredMenu(MENU);
    } else {
      const notAllowedRutesForNonSuperAdmin = ["/users"];
      setFilteredMenu(MENU.filter((item) => !notAllowedRutesForNonSuperAdmin.includes(item.path)));
    }
  }, [canManage]);

  return (
    <aside
      className={`border-bordercolor hidden h-screen w-20 flex-col border-r-2 bg-white transition-colors duration-300 md:flex xl:w-full xl:max-w-80 ${isBlack ? "border-gray-800 bg-black text-white" : "bg-background text-black"}`}
    >
      <div className="mb-6 flex items-center gap-3 px-4 py-6 xl:px-8 xl:py-8">
        <div className="flex h-10 w-10 items-center justify-center bg-black p-2">
          <Inventory2OutlinedIcon className="text-white" fontSize="medium" />
        </div>

        <h1 className="hidden text-center text-2xl font-bold xl:flex">
          Logistics <span className={isBlack ? "text-white" : "text-accent_color"}>Vision</span>
        </h1>
      </div>
      <nav className="flex flex-1 flex-col gap-2 px-4">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            aria-label={item.name}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-2 py-3 font-bold transition-all duration-200 xl:px-6 xl:py-4 ${
                isBlack
                  ? isActive
                    ? "bg-background justify-start text-black"
                    : "hover:bg-background justify-center text-gray-300 hover:text-black xl:justify-start"
                  : isActive
                    ? "bg-accent_color justify-start text-white"
                    : "justify-center text-gray-600 hover:bg-black hover:text-white xl:justify-start"
              }`
            }
          >
            {item.icon}
            <span className="hidden xl:inline">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className={`mx-2 my-8 mt-4 flex items-center justify-center gap-3 rounded-lg px-3 py-3 transition xl:mx-8 xl:justify-start ${
          isBlack
            ? "text-gray-300 hover:bg-red-500 hover:text-white"
            : "text-gray-600 hover:bg-red-500 hover:text-black"
        }`}
      >
        <LogoutIcon />
        <span className="hidden xl:inline">Cerrar sesión</span>
      </button>
    </aside>
  );
}
