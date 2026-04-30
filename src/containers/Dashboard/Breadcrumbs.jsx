import { useLocation, Link } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
import { CustomContainer } from "../../components/generic/CustomContainer";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <div className="flex items-center gap-2 text-md text-gray-500">
      <Link to="/" className="flex items-center gap-1 opacity-80 hover:text-black">
        {/* <FolderIcon fontSize="small" /> */}
        Inicio
      </Link>pcusz

      {pathnames.map((value, index) => {
        const to = "/" + pathnames.slice(0, index + 1).join("/");

        return (
          <div key={to} className="flex items-center gap-2">
            <span className="text-gray-400">›</span>

            <Link
              to={to}
              className={`capitalize px-2 py-1 rounded-md transition
                ${index === pathnames.length - 1
                  ? "bg-gray-200 text-accent_color font-bold"
                  : "hover:bg-gray-100"
                }`}
            >
              {value}
            </Link>
          </div>
        );
      })}
    </div>
  );
}