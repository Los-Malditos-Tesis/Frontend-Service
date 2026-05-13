import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import CustomSelect from "../../components/generic/CustomSelect";
import { createProduct, updateProduct } from "../../services/product.service";
import { searchSuppliers } from "../../services/supplier.service";
import { productSchema } from "../../validations/ProductSchema";
import { getSuppliers } from "../../services/api";

const categories = [
  { value: "Electrónica", label: "Electrónica" },
  { value: "Periféricos", label: "Periféricos" },
  { value: "Monitores", label: "Monitores" },
  { value: "Accesorios", label: "Accesorios" },
  { value: "Software", label: "Software" },
];

const ProductForm = ({ selectedProduct, onSuccess }) => {
  const [suppliers, setSuppliers] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      code: "",
      sku: "",
      category: "",
      supplier_id: "",
    },
  });

  const categoryValue = watch("category");
  const supplierValue = watch("supplier_id");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        // const { data } = await getSuppliers();
        const result = await searchSuppliers();
        if (result.success) {
          const options = result.data.map((supplier) => ({
            value: supplier.id.toString(),
            label: supplier.name,
          }));
          setSuppliers(options);
        } else {
          toast.error("Error al cargar proveedores");
        }
      } catch {
        toast.error("Error al cargar proveedores");
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      reset({
        name: selectedProduct.name ?? "",
        code: selectedProduct.code ?? "",
        sku: selectedProduct.sku ?? "",
        category: selectedProduct.category ?? "",
        supplier_id: selectedProduct.supplier_id?.toString() ?? selectedProduct.Supplier?.id?.toString() ?? "",
      });
    } else {
      reset({
        name: "",
        code: "",
        sku: "",
        category: "",
        supplier_id: "",
      });
    }
  }, [selectedProduct, reset]);

  const onSubmit = async (data) => {
    try {
      let result;

      if (selectedProduct) {
        result = await updateProduct(selectedProduct.id, data);
        if (result.success) {
          toast.success("Producto actualizado correctamente");
        } else {
          throw new Error(result.error);
        }
      } else {
        result = await createProduct(data);
        if (result.success) {
          toast.success("Producto creado correctamente");
        } else {
          throw new Error(result.error);
        }
      }
      onSuccess();
      reset();
    } catch (err) {
      const errorMsg = err?.message || "Error en la operación";
      toast.error(errorMsg);
      console.error("Form submission error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
      <CustomInput
        labelText="Nombre"
        {...register("name")}
        errors={errors.name}
      />

      <CustomInput
        labelText="Código"
        {...register("code")}
        errors={errors.code}
      />

      <CustomInput
        labelText="SKU"
        {...register("sku")}
        errors={errors.sku}
      />

      <CustomSelect
        labelText="Categoría"
        placeholderLabel="Debes seleccionar una categoría"
        options={categories}
        value={categoryValue}
        {...register("category")}
        errors={errors.category}
      />

      <CustomSelect
        labelText="Proveedor"
        placeholderLabel="Debes seleccionar un proveedor"
        options={suppliers}
        value={supplierValue}
        {...register("supplier_id")}
        errors={errors.supplier_id}
      />

      <div className="mt-6">
        <CustomButton type="submit" loading={isSubmitting}>
          {selectedProduct ? "Actualizar" : "Crear Producto"}
        </CustomButton>
      </div>
    </form>
  );
};

export default ProductForm;
