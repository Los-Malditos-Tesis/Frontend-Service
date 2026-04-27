import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import CustomSelect from "../../components/generic/CustomSelect";
import { createProduct, updateProduct, getSuppliers } from "../../services/api";
import { productSchema } from "../../validations/ProductSchema";

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
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const { data } = await getSuppliers();
        const options = data.map((supplier) => ({
          value: supplier.id.toString(),
          label: supplier.name,
        }));
        setSuppliers(options);
      } catch {
        toast.error("Error al cargar proveedores");
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setValue("name", selectedProduct.name);
      setValue("code", selectedProduct.code);
      setValue("sku", selectedProduct.sku);
      setValue("category", selectedProduct.category);
      setValue("supplier_id", selectedProduct.supplier_id.toString());
    } else {
      reset();
    }
  }, [selectedProduct, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, data);
        toast.success("Producto actualizado");
      } else {
        await createProduct(data);
        toast.success("Producto creado");
      }
      onSuccess();
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error en la operación");
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
        options={categories}
        {...register("category")}
        errors={errors.category}
      />

      <CustomSelect
        labelText="Proveedor"
        options={suppliers}
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
