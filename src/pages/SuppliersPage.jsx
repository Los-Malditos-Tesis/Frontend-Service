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
    <DashboardLayout>
      <CustomContainer>
        <div className="space-y-6">
          <SectionIntro
            title="Gestión de Proveedores"
            subtitle="Administra el catálogo maestro de proveedores, crea nuevos accesos y controla su relación con productos."
            eyebrow={<Breadcrumbs />}
            smaller
            className="pb-8 md:pb-10 mb-6 md:mb-8 pt-6"
          >
            <CustomButton
              startIcon={<AddIcon />}
              className="max-w-[13rem] ml-auto" action={handleCreateSupplier}>
              Crear proveedor
            </CustomButton>
          </SectionIntro>

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
        </div>
      </CustomContainer>
    </DashboardLayout>

  );
};

export default SuppliersPage;
