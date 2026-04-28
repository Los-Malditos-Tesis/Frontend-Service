import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getProducts } from "../services/api";
import ProductsTable from "../containers/Products/ProductsTable";
import ProductForm from "../containers/Products/ProductForm";
import CustomButton from "../components/generic/CustomButton";
import CustomDrawer from "../components/generic/CustomDrawer";
import { CustomContainer } from "../components/generic/CustomContainer";
import { SectionIntro } from "../components/generic/SectionIntro";
import DashboardLayout from "../containers/Dashboard/DashboardLayout";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import AddIcon from "@mui/icons-material/Add";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCloseDrawer = () => {
    setSelectedProduct(null);
    setIsDrawerOpen(false);
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsDrawerOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await getProducts();
      setProducts(data || []);
    } catch {
      toast.error("Error al obtener productos");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <DashboardLayout>
      <CustomContainer>
        <div className="space-y-6">

          <SectionIntro
            title="Gestión de Productos"
            subtitle="Administra el catálogo maestro de productos, crea nuevos accesos y controla su relación con proveedores."
            eyebrow={<Breadcrumbs />}
            smaller
            className="pb-8 md:pb-10 mb-6 md:mb-8 pt-6"
          >
            <CustomButton
              startIcon={<AddIcon />}
              className="max-w-[13rem] ml-auto" action={handleCreateProduct}>
              Crear producto
            </CustomButton>
          </SectionIntro>

          <CustomDrawer
            isOpen={isDrawerOpen}
            onClose={handleCloseDrawer}
            title={selectedProduct ? "Editar Producto" : "Crear Producto"}
          >
            <ProductForm
              selectedProduct={selectedProduct}
              onSuccess={() => {
                fetchProducts();
                handleCloseDrawer();
              }}
            />
          </CustomDrawer>

          <ProductsTable
            products={products}
            loading={loading}
            onEdit={handleEditProduct}
            onRefresh={fetchProducts}
          />
        </div>
      </CustomContainer>
    </DashboardLayout>
  );
};

export default ProductsPage;
