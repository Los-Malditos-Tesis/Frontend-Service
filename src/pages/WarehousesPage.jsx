import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getWarehouses } from "../services/api";
import WarehousesTable from "../containers/Warehouses/WarehousesTable";
import WarehouseForm from "../containers/Warehouses/WarehouseForm";
import CustomDrawer from "../components/generic/CustomDrawer";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";

const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCloseDrawer = () => {
    setSelectedWarehouse(null);
    setIsDrawerOpen(false);
  };

  const handleCreateWarehouse = () => {
    setSelectedWarehouse(null);
    setIsDrawerOpen(true);
  };

  const handleEditWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDrawerOpen(true);
  };

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const { data } = await getWarehouses();
      setWarehouses(data || []);
    } catch {
      toast.error("Error al obtener bodegas");
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <AdminIntroLayout
      title="Gestión de Bodegas"
      subtitle="Administra los centros de distribución y consulta su estado general."
      eyebrow={<Breadcrumbs />}
      buttonLabel="Crear bodega"
      onCreate={handleCreateWarehouse}
    >
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={selectedWarehouse ? "Editar Bodega" : "Crear Bodega"}
      >
        <WarehouseForm
          selectedWarehouse={selectedWarehouse}
          onSuccess={() => {
            fetchWarehouses();
            handleCloseDrawer();
          }}
        />
      </CustomDrawer>

      <WarehousesTable
        warehouses={warehouses}
        loading={loading}
        onEdit={handleEditWarehouse}
        onRefresh={fetchWarehouses}
      />
    </AdminIntroLayout>
  );
};

export default WarehousesPage;
