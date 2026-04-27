import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUsers } from "../services/api";
import UsersTable from "../containers/Users/UsersTable";
import UserForm from "../containers/Users/UserForm";
import CustomButton from "../components/generic/CustomButton";
import CustomDrawer from "../components/generic/CustomDrawer";
import { CustomContainer } from "../components/generic/CustomContainer";
import { SectionIntro } from "../components/generic/SectionIntro";

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
    <CustomContainer>

      <div className=" space-y-6">

        <SectionIntro
          title="Gestión de Usuarios"
          eyebrow="Administración"
          divider
          vertical
        >
            <p>
              Administra los usuarios del sistema, crea nuevos accesos y controla permisos.
            </p>

            <CustomButton className="max-w-xs" action={handleCreateUser}>
              Crear usuarios
            </CustomButton>
        </SectionIntro>

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
      </div>
    </CustomContainer>

  );
};

export default UsersPage;