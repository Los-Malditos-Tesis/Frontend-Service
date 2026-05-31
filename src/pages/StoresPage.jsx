import { useEffect, useState } from "react";
import { toast } from "sonner";
import { searchStores } from "../services/store.service";
import StoreTable from "../containers/Stores/StoreTable";
import StoreForm from "../containers/Stores/StoreForm";
import CustomDrawer from "../components/generic/CustomDrawer";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import { useAuth } from "../context/AuthContext";
import { canManageGeneral } from "../utils/accessControl";

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();
  const canManage = canManageGeneral(user);

  const handleCloseDrawer = () => {
    setSelectedStore(null);
    setIsDrawerOpen(false);
  };

  const handleCreateStore = () => {
    setSelectedStore(null);
    setIsDrawerOpen(true);
  };

  const handleEditStore = (store) => {
    setSelectedStore(store);
    setIsDrawerOpen(true);
  };

  const fetchStores = async () => {
    try {
      setLoading(true);
      const result = await searchStores();

      if (result.success) {
        setStores(result.data || []);
        if (result.fromMock) {
          toast.info("Usando datos locales (offline)");
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error(error?.message || "Error al obtener tiendas");
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <AdminIntroLayout
      title="Gestión de Tiendas"
      subtitle="Administra las tiendas registradas en el sistema, crea nuevos accesos y controla su información principal."
      eyebrow={<Breadcrumbs />}
      buttonLabel={canManage ? "Crear tienda" : undefined}
      onCreate={canManage ? handleCreateStore : undefined}
    >
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={selectedStore ? "Editar Tienda" : "Crear Tienda"}
      >
        <StoreForm
          selectedStore={selectedStore}
          onSuccess={() => {
            fetchStores();
            handleCloseDrawer();
          }}
        />
      </CustomDrawer>

      <StoreTable
        stores={stores}
        loading={loading}
        onEdit={handleEditStore}
        onRefresh={fetchStores}
        canManage={canManage}
      />
    </AdminIntroLayout>
  );
};

export default StoresPage;
