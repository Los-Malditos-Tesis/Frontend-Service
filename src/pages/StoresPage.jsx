import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getStores } from "../services/api";
import StoreTable from "../containers/Stores/StoreTable";
import StoreForm from "../containers/Stores/StoreForm";
import CustomDrawer from "../components/generic/CustomDrawer";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      const { data } = await getStores();
      setStores(data || []);
    } catch {
      toast.error("Error al obtener tiendas");
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
      buttonLabel="Crear tienda"
      onCreate={handleCreateStore}
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
      />
    </AdminIntroLayout>
  );
};

export default StoresPage;