import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Chip } from "@mui/material";
import { CustomContainer } from "../../components/generic/CustomContainer";
import { useAuth } from "../../context/AuthContext";

const pages = [
  { name: "dashboard", path: "/" },
  { name: "usuarios", path: "/usuarios" },
  { name: "productos", path: "/productos" },
  { name: "tiendas", path: "/stores" },
];

export default function Topbar() {
  const [query, setQuery] = useState("");
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

  return (
    <CustomContainer className="py-0!">
      <div className="w-full flex items-center justify-between relative">
        {/* Search */}
        <div className="relative w-72">
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
                    className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
                  >
                    {item.name}
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
        <div className="flex items-center gap-4">
          {/* Roles */}
          <div className="flex gap-2">
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
          <div className="w-9 h-9 rounded-full bg-gray-300" />
        </div>
      </div>
    </CustomContainer>
  );
}