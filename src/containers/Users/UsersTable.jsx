import { toast } from "sonner";
import { createColumnHelper } from "@tanstack/react-table";

import { Edit, Delete, LockReset } from "@mui/icons-material";

import { deleteUser, resetPassword } from "../../services/api";
import CustomTable from "../../components/generic/CustomTable";

const columnHelper = createColumnHelper();

const UsersTable = ({ users = [], loading, onEdit, onRefresh }) => {
  // HANDLERS
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar usuario?")) return;

    try {
      await deleteUser(id);
      toast.success("Usuario eliminado");
      onRefresh();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleReset = async (id) => {
    try {
      await resetPassword(id);
      toast.success("Password reseteado");
    } catch {
      toast.error("Error al resetear");
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
    columnHelper.accessor("role", {
      header: "Assigned Role",
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
              onClick={() => handleDelete(u.id)}
              className="rounded-lg p-2 transition hover:bg-red-50 active:scale-95"
            >
              <Delete fontSize="small" />
            </button>

            <button
              onClick={() => handleReset(u.id)}
              className="rounded-lg p-2 transition hover:bg-yellow-50 active:scale-95"
            >
              <LockReset fontSize="small" />
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
      showPagination={true}
    />
  );
};

export default UsersTable;