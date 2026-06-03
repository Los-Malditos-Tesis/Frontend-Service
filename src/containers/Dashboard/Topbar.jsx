import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { Chip } from "@mui/material";
import { CustomContainer } from "../../components/generic/CustomContainer";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/conts.jsx";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { NavLink } from "react-router-dom";

const pages = ROUTES;
//  [
//   { name: "dashboard", path: "/" },
//   { name: "proveedores", path: "/proveedores" },
//   { name: "usuarios", path: "/usuarios" },
//   { name: "productos", path: "/productos" },
//   { name: "tiendas", path: "/stores" },
//   { name: "api test", path: "/api-test" },
// ];

export default function Topbar() {
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Extraer roles del usuario
  const getUserRoles = () => {
    if (!user) return [];
    
    if (Array.isArray(user.roles)) {
      return user.roles.map((r) => (typeof r === "string" ? r : r.name || r.id));
    } else if (user.role) {
      return [typeof user.role === "string" ? user.role : user.role.name || user.role.id];
    }
    return [];
  };

  const userRoles = getUserRoles();
  

  const filtered = pages.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <CustomContainer className="py-0!">
      <div className="w-full flex items-center justify-between gap-4 relative">
        <div className="flex items-center gap-3 md:hidden min-w-0">
          <div className="bg-black p-2 w-10 h-10 flex items-center justify-center shrink-0">
            <Inventory2OutlinedIcon className="text-white" fontSize="medium" />
          </div>

          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-400">
              Logistics
            </p>
            <p className="text-sm font-bold text-gray-800 truncate">
              Vision
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-72 hidden md:block">
          <label className="border-2 border-bordercolor bg-background flex items-center bg-gray-100 px-4 py-2.5 rounded-xl w-full max-w-xl cursor-text focus-within:ring-2 focus-within:ring-blue-500">
            <SearchIcon className="text-gray-400" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar recursos..."
              className="bg-transparent outline-none ml-3 w-full text-sm text-gray-700 placeholder-gray-400"
            />
          </label>

          {/* Dropdown */}
          {query && (
            <div className="absolute w-full bg-white shadow-lg rounded-lg mt-2 z-50">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <div
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setQuery("");
                    }}
                    className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer flex items-center justify-between"
                  >
                    <span>{item.name}</span>
                    <span className="shrink-0 ml-2">{item.icon}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  No encontrado
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="block md:hidden">
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              className="!text-gray-700"
              aria-label="Abrir menú"
              >
              <MenuIcon />
            </IconButton>
          </div>

          {/* Roles */}
          <div className="hidden md:flex gap-2">
            {userRoles.map((role) => (
              <Chip
                key={role}
                label={role}
                size="small"
                variant="outlined"
                color="primary"
              />
            ))}
          </div>
          {/* <NotificationsNoneIcon className="text-gray-600 cursor-pointer" /> */}
          {/* <div className="w-9 h-9 rounded-full bg-gray-300" /> */}
        </div>
      </div>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: "86%",
            maxWidth: 320,
            backgroundImage: "none",
          },
        }}
      >
        <div className="flex h-full flex-col bg-background">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-black p-2 w-10 h-10 flex items-center justify-center shrink-0">
                <Inventory2OutlinedIcon className="text-white" fontSize="medium" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gray-400">
                  Logistics
                </p>
                <p className="text-sm font-bold text-gray-800">Vision</p>
              </div>
            </div>

            <IconButton onClick={closeMobileMenu} aria-label="Cerrar menú">
              <CloseIcon />
            </IconButton>
          </div>

          <div className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">
              Navegación
            </p>

            <nav className="flex flex-col gap-2">
              {ROUTES.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? "bg-accent_color text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <span>{item.name}</span>
                  <span className="shrink-0 ml-2">{item.icon}</span>
                </NavLink>
              ))}
            </nav>

            <Divider sx={{ my: 3 }} />

            <div className="flex flex-wrap gap-2">
              {userRoles.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </CustomContainer>
  );
}