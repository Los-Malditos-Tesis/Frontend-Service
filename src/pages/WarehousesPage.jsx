import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getWarehouses } from "../services/api";
import WarehousesTable from "../containers/Warehouses/WarehousesTable";
import WarehouseForm from "../containers/Warehouses/WarehouseForm";
import CustomButton from "../components/generic/CustomButton";
import CustomDrawer from "../components/generic/CustomDrawer";
import { CustomContainer } from "../components/generic/CustomContainer";
import { SectionIntro } from "../components/generic/SectionIntro";

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
    <CustomContainer>
      <div className="space-y-6">
        <SectionIntro
          title="Red de Distribución"
          eyebrow="Gestión de Bodegas"
          divider
          vertical
        >
          <p>
            Administra las bodegas y centros de distribución, consulta ubicaciones y existencias globales.
          </p>

          <CustomButton className="max-w-xs" action={handleCreateWarehouse}>
            Crear bodega
          </CustomButton>
        </SectionIntro>

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
      </div>
    </CustomContainer>
  );
};

export default WarehousesPage;
