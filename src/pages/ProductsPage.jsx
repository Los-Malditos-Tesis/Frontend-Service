import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { searchProducts } from "../services/product.service";
import ProductsTable from "../containers/Products/ProductsTable";
import ProductForm from "../containers/Products/ProductForm";
import CustomDrawer from "../components/generic/CustomDrawer";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import { canManageGeneral } from "../utils/accessControl";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();
  const canManage = canManageGeneral(user);

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
      const result = await searchProducts();

      if (result.success) {
        setProducts(result.data || []);
        if (result.fromMock) {
          toast.info("Usando datos locales (offline)");
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error?.message || "Error al obtener productos");
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
      buttonLabel={canManage ? "Crear productos" : undefined}
      onCreate={canManage ? handleCreateProduct : undefined}
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
        canManage={canManage}
      />
    </AdminIntroLayout>
  );
};

export default ProductsPage;
