import { toast } from "sonner";
import { createColumnHelper } from "@tanstack/react-table";

import { Edit, Lock, Visibility } from "@mui/icons-material";
import Chip from "@mui/material/Chip";

import { blockUser, findUserById } from "../../services/api";
import CustomTable from "../../components/generic/CustomTable";

const columnHelper = createColumnHelper();

const UsersTable = ({ users = [], loading, onEdit, onRefresh, showPagination = true }) => {
  // HANDLERS
  const handleBlock = async (id) => {
    if (!confirm("¿Bloquear usuario?")) return;

    try {
      await blockUser(id);
      toast.success("Usuario bloqueado");
      onRefresh();
    } catch {
      toast.error("Error al bloquear");
    }
  };

  // COLUMNAS
  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("email", {
      header: "Email Address",
    }),
    columnHelper.accessor("roles", {
      header: "Roles",
      cell: ({ getValue }) => {
        const roles = getValue() || [];
        const colorFor = (id) => {
          switch ((id || "").toUpperCase()) {
            case "SUPERADMIN":
              return "#7C3AED"; // purple
            case "ADMIN":
              return "#DC2626"; // red
            case "EDITOR":
              return "#F59E0B"; // amber
            case "USER":
            default:
              return "#2563EB"; // blue
          }
        };

        return (
          <div className="flex flex-wrap gap-2">
            {roles.map((r) => (
              <Chip
                key={r.id}
                label={r.id}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: colorFor(r.id),
                  color: colorFor(r.id),
                  fontWeight: 700,
                }}
              />
            ))}
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getValue()
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {getValue() ? "Activo" : "Bloqueado"}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const u = row.original;

        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onEdit(u)}
              className="rounded-lg p-2 transition hover:bg-gray-100 active:scale-95"
            >
              <Edit fontSize="small" />
            </button>

            <button
              onClick={() => handleBlock(u.id)}
              className="rounded-lg p-2 transition hover:bg-yellow-50 active:scale-95"
            >
              <Lock fontSize="small" />
            </button>
          </div>
        );
      },
    }),
  ];

  return (
    <CustomTable
      title="Usuarios"
      data={users}
      columns={columns}
      loading={loading}
      loadingText="Cargando..."
      emptyTitle="Sin usuarios"
      emptyDescription="No hay datos aún."
      searchPlaceholder="Buscar usuario..."
      showColumnFilters={false}
      showPagination={showPagination}
    />
  );
};

export default UsersTable;