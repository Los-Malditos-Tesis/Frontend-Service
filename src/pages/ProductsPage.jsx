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
import AdminIntroLayout from "../components/generic/AdminIntroLayout";

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
    <AdminIntroLayout
      title="Gestión de Productos"
      subtitle="Administra el catálogo maestro de productos, crea nuevos accesos y controla su relación con proveedores."
      eyebrow={<Breadcrumbs />}
      buttonLabel="Crear productos"
      onCreate={handleCreateProduct}
    >
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
    </AdminIntroLayout >

  );
};

export default ProductsPage;
