import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUsers } from "../services/api";
import UsersTable from "../containers/Users/UsersTable";
import UserForm from "../containers/Users/UserForm";
import CustomButton from "../components/generic/CustomButton";
import CustomDrawer from "../components/generic/CustomDrawer";
import { CustomContainer } from "../components/generic/CustomContainer";
import { SectionIntro } from "../components/generic/SectionIntro";
import DashboardLayout from "../containers/Dashboard/DashboardLayout";
import AddIcon from "@mui/icons-material/Add";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCloseDrawer = () => {
    setSelectedUser(null);
    setIsDrawerOpen(false);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsDrawerOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await getUsers();
      setUsers(data || []);
    } catch {
      toast.error("Error al obtener usuarios");
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
      buttonLabel="Crear usuarios"
      onCreate={handleCreateUser}
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
      />
    </AdminIntroLayout>
  );
};

export default UsersPage;