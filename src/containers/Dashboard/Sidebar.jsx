import { NavLink } from "react-router-dom";
import { MENU } from "../../utils/conts.jsx";
import LogoutIcon from "@mui/icons-material/Logout";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

export default function Sidebar({ isBlack = false }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside
      className={`bg-white h-screen w-20 xl:w-full xl:max-w-80 flex flex-col border-r-2 border-bordercolor transition-colors duration-300
      ${isBlack ? "bg-black text-white border-gray-800" : "bg-background text-black"}`}
    >
      <div className="px-4 py-6 xl:px-8 xl:py-8 flex gap-3 items-center mb-6">
        <div className="bg-black p-2 w-10 h-10 flex items-center justify-center">
          <Inventory2OutlinedIcon className="text-white" fontSize="medium" />
        </div>

        <h1 className="hidden xl:flex text-2xl text-center font-bold">
          Logistics{" "}
          <span className={isBlack ? "text-white" : "text-accent_color"}>
            Vision
          </span>
        </h1>
      </div>
      <nav className="px-4 flex flex-col gap-2 flex-1">
        {MENU.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            aria-label={item.name}
            className={({ isActive }) =>
              `flex items-center gap-3 font-bold rounded-lg transition-all duration-200 px-2 py-3 xl:px-6 xl:py-4
              ${isBlack
                ? isActive
                  ? "bg-background text-black justify-start"
                  : "text-gray-300 hover:bg-background hover:text-black justify-center xl:justify-start"
                : isActive
                  ? "bg-accent_color text-white justify-start"
                  : "text-gray-600 hover:bg-black hover:text-white justify-center xl:justify-start"
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
        className={`mx-2 xl:mx-8 my-8 flex items-center gap-3 px-3 py-3 mt-4 rounded-lg transition justify-center xl:justify-start
        ${isBlack
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