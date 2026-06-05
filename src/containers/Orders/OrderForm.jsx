import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import CustomSelect from "../../components/generic/CustomSelect";
import { createOrder } from "../../services/order.service";
import { ORDER_TYPES, ORDER_UNIT_TYPES } from "../../utils/conts.jsx";
import { orderSchema } from "../../validations/OrderSchema.jsx";
import { Controller } from "react-hook-form";
import CustomAutocomplete from "../../components/generic/CustomAutocomplete";

const orderTypeOptions = [
  { value: ORDER_TYPES.SALE, label: "Venta a tienda" },
  { value: ORDER_TYPES.TRANSFER, label: "Transferencia entre bodegas" },
];

const unitTypeOptions = [
  { value: ORDER_UNIT_TYPES.PALLET, label: "Pallet" },
  { value: ORDER_UNIT_TYPES.BOX, label: "Caja" },
];

const OrderForm = ({ warehouses = [], stores = [], products = [], onSuccess }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      type: ORDER_TYPES.SALE,
      unit_type: ORDER_UNIT_TYPES.PALLET,
      origin_warehouse_id: "",
      product_id: "",
      total_quantity: "",
      destination_warehouse_id: "",
      store_id: "",
    },
  });

  const orderType = watch("type");
  const unitType = watch("unit_type");
  const originWarehouseId = watch("origin_warehouse_id");
  const productId = watch("product_id");
  const totalQuantity = watch("total_quantity");
  const destinationWarehouseId = watch("destination_warehouse_id");
  const storeId = watch("store_id");

  useEffect(() => {
    if (orderType === ORDER_TYPES.SALE) {
      setValue("destination_warehouse_id", "");
    }

    if (orderType === ORDER_TYPES.TRANSFER) {
      setValue("store_id", "");
    }
  }, [orderType, setValue]);

  useEffect(() => {
    if (
      orderType === ORDER_TYPES.TRANSFER &&
      destinationWarehouseId &&
      destinationWarehouseId === originWarehouseId
    ) {
      setValue("destination_warehouse_id", "");
    }
  }, [destinationWarehouseId, orderType, originWarehouseId, setValue]);

  const destinationOptions = useMemo(() => {
    if (orderType === ORDER_TYPES.TRANSFER) {
      return warehouses
        .filter((warehouse) => warehouse.id?.toString() !== originWarehouseId?.toString())
        .map((warehouse) => ({
          value: warehouse.id?.toString() || "",
          label: warehouse.name,
        }));
    }

    return stores.map((store) => ({
      value: store.id?.toString() || "",
      label: `${store.name}${store.code ? ` · ${store.code}` : ""}`,
    }));
  }, [orderType, stores, originWarehouseId, warehouses]);

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        value: product.id?.toString() || "",
        label: `${product.name}${product.code ? ` · ${product.code}` : ""}`,
      })),
    [products]
  );

  const onSubmit = async (data) => {
    try {
      const result = await createOrder({
        ...data,
        total_quantity: Number(data.total_quantity),
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Orden creada correctamente");
      reset({
        type: ORDER_TYPES.SALE,
        unit_type: ORDER_UNIT_TYPES.PALLET,
        origin_warehouse_id: "",
        product_id: "",
        total_quantity: "",
        destination_warehouse_id: "",
        store_id: "",
      });
      onSuccess();
    } catch (err) {
      const errorMsg = err?.message || "Error al crear la orden";
      toast.error(errorMsg);
      console.error("Order form submission error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
      {/* <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <SwapHorizOutlinedIcon className="text-accent_color" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Tipo de orden</p>
            <p className="mt-1 text-sm text-slate-600">
              {orderType === ORDER_TYPES.SALE
                ? "Venta a una tienda. Selecciona una bodega origen y la tienda destino."
                : "Transferencia entre bodegas. Selecciona bodega origen y bodega destino."}
            </p>
          </div>
        </div>
      </div> */}

      <CustomSelect
        name="type"
        labelText="Tipo de orden"
        placeholderLabel="Selecciona el tipo"
        options={orderTypeOptions}
        value={orderType}
        icon={<SwapHorizOutlinedIcon />}
        {...register("type")}
        errors={errors.type}
      />

      <CustomSelect
        name="unit_type"
        labelText="Unidad de movimiento"
        placeholderLabel="Selecciona la unidad"
        options={unitTypeOptions}
        value={unitType}
        icon={<Inventory2OutlinedIcon />}
        {...register("unit_type")}
        errors={errors.unit_type}
      />

      <CustomSelect
        name="origin_warehouse_id"
        labelText="Bodega origen"
        placeholderLabel="Selecciona la bodega origen"
        options={warehouses.map((warehouse) => ({
          value: warehouse.id?.toString() || "",
          label: warehouse.name,
        }))}
        value={originWarehouseId}
        icon={<WarehouseOutlinedIcon />}
        {...register("origin_warehouse_id")}
        errors={errors.origin_warehouse_id}
      />

      {/* <CustomSelect
        name="product_id"
        labelText="Producto"
        placeholderLabel="Selecciona el producto"
        options={productOptions}
        value={productId}
        icon={<CategoryOutlinedIcon />}
        {...register("product_id")}
        errors={errors.product_id}
        readOnly={!products.length}
      /> */}
      <Controller
        name="product_id"
        control={control}
        render={({ field }) => (
          <CustomAutocomplete
            {...field}
            name="product_id"
            labelText="Producto"
            placeholderLabel="Busca o selecciona el producto"
            options={productOptions}
            icon={<CategoryOutlinedIcon />}
            errors={errors.product_id}
            readOnly={!products.length}
          />
        )}
      />

      <CustomInput
        name="total_quantity"
        type="number"
        labelText={`Cantidad a mover (${unitType === ORDER_UNIT_TYPES.PALLET ? "Pallets" : "Cajas"})`}
        placeholder="Ej: 24"
        icon={<StraightenOutlinedIcon />}
        {...register("total_quantity", { valueAsNumber: true })}
        errors={errors.total_quantity}
      />

      {orderType === ORDER_TYPES.SALE ? (
        <CustomSelect
          name="store_id"
          labelText="Tienda destino"
          placeholderLabel="Selecciona la tienda destino"
          options={destinationOptions}
          value={storeId}
          icon={<StorefrontOutlinedIcon />}
          {...register("store_id")}
          errors={errors.store_id}
          readOnly={!stores.length}
        />
      ) : (
        <CustomSelect
          name="destination_warehouse_id"
          labelText="Bodega destino"
          placeholderLabel="Selecciona la bodega destino"
          options={destinationOptions}
          value={destinationWarehouseId}
          icon={<WarehouseOutlinedIcon />}
          {...register("destination_warehouse_id")}
          errors={errors.destination_warehouse_id}
          readOnly={!warehouses.length}
        />
      )}

      {/* <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2 shadow-sm">
            <LocalShippingOutlinedIcon className="text-amber-600" />
          </div>
          <div className="space-y-1">
            <p className="font-bold">Resumen rápido</p>
            <p>
              {orderType === ORDER_TYPES.SALE ? "Salida a tienda" : "Salida entre bodegas"} con unidad {unitType === ORDER_UNIT_TYPES.PALLET ? "Pallet" : "Caja"}.
            </p>
            <p>
              Producto: {products.find((product) => product.id?.toString() === productId?.toString())?.name || "--"} · Cantidad: {totalQuantity || "--"}
            </p>
          </div>
        </div>
      </div> */}

      <div className="mt-4">
        <CustomButton type="submit" loading={isSubmitting}>
          Crear orden
        </CustomButton>
      </div>
    </form>
  );
};

export default OrderForm;
