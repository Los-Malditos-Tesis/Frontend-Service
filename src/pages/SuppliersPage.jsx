import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSuppliersDirectory } from "../services/api";
import SuppliersTable from "../containers/Suppliers/SuppliersTable";
import SupplierForm from "../containers/Suppliers/SupplierForm";
import CustomButton from "../components/generic/CustomButton";
import CustomDrawer from "../components/generic/CustomDrawer";
import { CustomContainer } from "../components/generic/CustomContainer";
import { SectionIntro } from "../components/generic/SectionIntro";
import DashboardLayout from "../containers/Dashboard/DashboardLayout";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import AddIcon from "@mui/icons-material/Add";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";

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
    <AdminIntroLayout
      title="Gestión de Proveedores"
      subtitle="Administra el catálogo maestro de proveedores, crea nuevos accesos y controla su relación con productos."
      eyebrow={<Breadcrumbs />}
      buttonLabel="Crear proveedores"
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
    </AdminIntroLayout>
  );
};

export default SuppliersPage;
