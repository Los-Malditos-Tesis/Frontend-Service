import React from "react";
import { toast } from "sonner";
import { deleteUser, resetPassword } from "../../services/api";
import CustomButton from "../../components/generic/CustomButton";
import EmptyState from "../../components/generic/EmptyState";

const UsersTable = ({ users, loading, onEdit, onRefresh }) => {
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

  if (loading) return <p>Cargando usuarios...</p>;

  if (!users.length)
    return (
      <EmptyState
        title="Sin usuarios"
        description="Aún no hay usuarios registrados en el sistema."
        type="search"
      />
    );

  return (
    <div className="overflow-auto border rounded-lg">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-3">{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>

              <td className="flex gap-2 justify-center p-2">
                <CustomButton
                  className="!w-auto px-3"
                  action={() => onEdit(u)}
                >
                  Editar
                </CustomButton>

                <CustomButton
                  className="!w-auto px-3 bg-red-500"
                  action={() => handleDelete(u.id)}
                >
                  Eliminar
                </CustomButton>

                <CustomButton
                  className="!w-auto px-3 bg-yellow-500"
                  action={() => handleReset(u.id)}
                >
                  Reset Pass
                </CustomButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;