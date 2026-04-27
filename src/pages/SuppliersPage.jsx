import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSuppliersDirectory } from "../services/api";
import SuppliersTable from "../containers/Suppliers/SuppliersTable";
import SupplierForm from "../containers/Suppliers/SupplierForm";
import CustomDrawer from "../components/generic/CustomDrawer";
import SupplierLayout from "../components/generic/SupplierLayout";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCloseDrawer = () => {
    setSelectedSupplier(null);
    setIsDrawerOpen(false);
  };

  const handleCreateSupplier = () => {
    setSelectedSupplier(null);
    setIsDrawerOpen(true);
  };

  const handleEditSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDrawerOpen(true);
  };

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data } = await getSuppliersDirectory();
      setSuppliers(data || []);
    } catch {
      toast.error("Error al obtener proveedores");
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <SupplierLayout
      title="Directorio de Proveedores"
      eyebrow="Administración"
      description="Administra proveedores, consulta sus productos asociados y mantiene la información de contacto actualizada."
      buttonLabel="Crear proveedor"
      onCreate={handleCreateSupplier}
    >
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={selectedSupplier ? "Editar Proveedor" : "Crear Proveedor"}
      >
        <SupplierForm
          selectedSupplier={selectedSupplier}
          onSuccess={() => {
            fetchSuppliers();
            handleCloseDrawer();
          }}
        />
      </CustomDrawer>

      <SuppliersTable
        suppliers={suppliers}
        loading={loading}
        onEdit={handleEditSupplier}
        onRefresh={fetchSuppliers}
      />
    </SupplierLayout>
  );
};

export default SuppliersPage;
