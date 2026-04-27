import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getProducts } from "../services/api";
import ProductsTable from "../containers/Products/ProductsTable";
import ProductForm from "../containers/Products/ProductForm";
import CustomButton from "../components/generic/CustomButton";
import CustomDrawer from "../components/generic/CustomDrawer";
import { CustomContainer } from "../components/generic/CustomContainer";
import { SectionIntro } from "../components/generic/SectionIntro";

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
    <CustomContainer>
      <div className="space-y-6">
        <SectionIntro
          title="Catálogo de Productos"
          eyebrow="Gestión de Inventario"
          divider
          vertical
        >
          <p>
            Administra el catálogo maestro de productos, registra nuevos items y consulta existencias globales.
          </p>

          <CustomButton className="max-w-xs" action={handleCreateProduct}>
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
  );
};

export default ProductsPage;
