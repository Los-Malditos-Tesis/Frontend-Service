import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { searchUsers } from "../services/user.service";
import UsersTable from "../containers/Users/UsersTable";
import UserForm from "../containers/Users/UserForm";
import CustomDrawer from "../components/generic/CustomDrawer";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import { hasAnyRole } from "../utils/accessControl";
import { ROLES } from "../utils/conts.jsx";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();
  const canManage = hasAnyRole(user, [ROLES.SUPERADMIN]);

  const handleCloseDrawer = () => {
    setSelectedUser(null);
    setIsDrawerOpen(false);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsDrawerOpen(true);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await searchUsers();

      if (result.success) {
        setUsers(result.data || []);
        if (result.fromMock) toast.info("Usando datos locales (offline)");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error?.message || "Error al obtener usuarios");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AdminIntroLayout
      title="Gestión de Usuarios"
      subtitle="Administra los accesos y permisos de los usuarios en el sistema."
      eyebrow={<Breadcrumbs />}
      buttonLabel={canManage ? "Crear usuarios" : undefined}
      onCreate={canManage ? handleCreateUser : undefined}
    >
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={selectedUser ? "Editar Usuario" : "Crear Usuario"}
      >
        <UserForm
          selectedUser={selectedUser}
          onSuccess={() => {
            fetchUsers();
            handleCloseDrawer();
          }}
        />
      </CustomDrawer>

      <UsersTable
        users={users}
        loading={loading}
        onEdit={handleEditUser}
        onRefresh={fetchUsers}
        canManage={canManage}
      />
    </AdminIntroLayout>
  );
};

export default UsersPage;
