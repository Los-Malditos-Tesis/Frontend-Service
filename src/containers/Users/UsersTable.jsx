import { toast } from "sonner";
import { createColumnHelper } from "@tanstack/react-table";

import { Edit, Lock } from "@mui/icons-material";
import LockOpen from "@mui/icons-material/LockOpen";
import Chip from "@mui/material/Chip";

import { toggleUserStatus } from "../../services/user.service";
import CustomTable from "../../components/generic/CustomTable";

const columnHelper = createColumnHelper();

const UsersTable = ({
  users = [],
  loading,
  onEdit,
  onRefresh,
  showPagination = true,
  canManage = true,
}) => {
  // HANDLERS
  const handleToggleStatus = async (id, currentlyActive) => {
    const action = currentlyActive ? "bloquear" : "desbloquear";
    if (!confirm(`¿${action.charAt(0).toUpperCase() + action.slice(1)} usuario?`)) return;

    try {
      const result = await toggleUserStatus(id);
      if (result.success) {
        toast.success(`Usuario ${currentlyActive ? "bloqueado" : "desbloqueado"}`);
        onRefresh();
      } else {
        throw new Error(result.error || "Error en la operación");
      }
    } catch (err) {
      toast.error(err?.message || `Error al ${action}`);
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
              return "#7C3AED80"; // purple
            case "ADMIN":
              return "#DC262680"; // red
            case "EDITOR":
              return "#F59E0B80"; // amber
            case "USER":
            default:
              return "#2563EB80"; // blue
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
    columnHelper.accessor("active", {
      header: "Status",
      cell: ({ getValue }) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            getValue() ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {getValue() ? "Activo" : "Bloqueado"}
        </span>
      ),
    }),
  ];

  if (canManage) {
    columns.push(
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
                onClick={() => handleToggleStatus(u.id, u.active)}
                className="rounded-lg p-2 transition hover:bg-yellow-50 active:scale-95"
                title={u.active ? "Bloquear usuario" : "Desbloquear usuario"}
              >
                {u.active ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
              </button>
            </div>
          );
        },
      })
    );
  }

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
