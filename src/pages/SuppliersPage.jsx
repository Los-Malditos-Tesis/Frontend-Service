import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { searchSuppliers } from "../services/supplier.service";
import SuppliersTable from "../containers/Suppliers/SuppliersTable";
import SupplierForm from "../containers/Suppliers/SupplierForm";
import CustomDrawer from "../components/generic/CustomDrawer";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import { canManageGeneral } from "../utils/accessControl";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();
  const canManage = canManageGeneral(user);

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
      const result = await searchSuppliers();

      if (result.success) {
        console.log("Proveedores obtenidos:", result.data);
        setSuppliers(result.data || []);
        if (result.fromMock) {
          toast.info("Usando datos locales (offline)");
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error(error?.message || "Error al obtener proveedores");
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <AdminIntroLayout
      title="Gestión de Proveedores"
      subtitle="Administra el catálogo maestro de proveedores, crea nuevos accesos y controla su relación con productos."
      eyebrow={<Breadcrumbs />}
      buttonLabel={canManage ? "Crear proveedores" : undefined}
      onCreate={canManage ? handleCreateSupplier : undefined}
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
        canManage={canManage}
      />
    </AdminIntroLayout>
  );
};

export default SuppliersPage;
