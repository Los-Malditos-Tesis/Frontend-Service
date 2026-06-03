import { useMemo, useState } from "react";
import { toast } from "sonner";
import { createColumnHelper } from "@tanstack/react-table";

import { Edit, Delete } from "@mui/icons-material";

import { deleteCamera } from "../../services/camera.service";
import CustomTable from "../../components/generic/CustomTable";
import TableExportButtons from "../../components/generic/TableExportButtons";
import WarehouseSelect from "../../components/generic/WarehouseSelect";
import { exportRowsToCsv, exportRowsToExcel } from "../../utils/exportTable";

const columnHelper = createColumnHelper();

const getWarehouse = (camera) => {
  const warehouse = camera?.location?.Warehouse;

  if (warehouse?.id || warehouse?.name) {
    return {
      id: warehouse.id?.toString() || "",
      name: warehouse.name || "Sin bodega",
    };
  }

  return {
    id: "",
    name: "Sin bodega",
  };
};

const getWarehouseGroupKey = (camera) => {
  const warehouse = getWarehouse(camera);
  return warehouse.id || warehouse.name || "Sin bodega";
};

const CamerasTable = ({ cameras = [], loading, onEdit, onRefresh, canManage = true }) => {
  const [warehouseFilter, setWarehouseFilter] = useState("");

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar cámara?")) return;

    try {
      const result = await deleteCamera(id);
      if (result.success) {
        toast.success("Cámara eliminada correctamente");
        onRefresh();
      } else {
        toast.error(result.error || "Error al eliminar la cámara");
      }
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const warehouseOptions = useMemo(() => {
    const byId = new Map();

    cameras.forEach((camera) => {
      const warehouse = getWarehouse(camera);

      if (warehouse.id && !byId.has(warehouse.id)) {
        byId.set(warehouse.id, {
          value: warehouse.id,
          label: warehouse.name,
        });
      }
    });

    return Array.from(byId.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [cameras]);

  const groupedAndFilteredCameras = useMemo(() => {
    const filtered = cameras.filter((camera) => {
      if (!warehouseFilter) {
        return true;
      }

      const warehouse = getWarehouse(camera);
      return warehouse.id === warehouseFilter;
    });

    const sorted = [...filtered].sort((a, b) => {
      const warehouseA = getWarehouse(a).name;
      const warehouseB = getWarehouse(b).name;

      const warehouseCompare = warehouseA.localeCompare(warehouseB);
      if (warehouseCompare !== 0) {
        return warehouseCompare;
      }

      return (a.code || "").localeCompare(b.code || "");
    });

    return sorted.map((camera) => {
      const warehouse = getWarehouse(camera);

      return {
        ...camera,
        warehouseName: warehouse.name,
      };
    });
  }, [cameras, warehouseFilter]);

  const exportRows = useMemo(
    () =>
      groupedAndFilteredCameras.map((camera) => ({
        ID: camera.id || "--",
        Código: camera.code || "--",
        Bodega: camera.warehouseName || "Sin bodega",
        Zona: camera.location?.zone || "Sin ubicación",
        "API Key": camera.api_key ? "••••••••••••••••••••••••" : "--",
      })),
    [groupedAndFilteredCameras]
  );

  const columns = [
    columnHelper.accessor("code", {
      header: "Código",
    }),
    columnHelper.accessor("warehouseName", {
      header: "Bodega",
      cell: ({ getValue }) => getValue() || "Sin bodega",
    }),
    columnHelper.accessor("location", {
      header: "Zona",
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? `${value?.zone}` : "Sin ubicación";
      },
    }),
    columnHelper.accessor("api_key", {
      header: "API Key",
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? `${value}` : "••••••••••••••••••••••••";
      },
    }),
  ];

  if (canManage) {
    columns.push(
      columnHelper.display({
        id: "actions",
        header: "Acciones",
        enableColumnFilter: false,
        cell: ({ row }) => {
          const camera = row.original;

          return (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => onEdit(camera)}
                className="rounded-lg p-2 transition hover:bg-gray-100 active:scale-95"
              >
                <Edit fontSize="small" />
              </button>

              <button
                onClick={() => handleDelete(camera.id)}
                className="rounded-lg p-2 transition hover:bg-red-50 active:scale-95"
              >
                <Delete fontSize="small" className="text-red-700" />
              </button>
            </div>
          );
        },
      })
    );
  }

  return (
    <CustomTable
      title="Cámaras"
      data={groupedAndFilteredCameras}
      columns={columns}
      loading={loading}
      loadingText="Cargando..."
      emptyTitle="Sin cámaras"
      emptyDescription="No hay datos aún."
      searchPlaceholder="Buscar cámara..."
      toolbarRight={
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-end">
          <div className="w-full md:w-[250px]">
            <WarehouseSelect
              labelText=""
              placeholderLabel="Filtrar por bodega"
              options={warehouseOptions}
              value={warehouseFilter}
              onChange={(event) => setWarehouseFilter(event.target.value)}
              name="warehouse_filter"
            />
          </div>

          <TableExportButtons
            onExcel={() =>
              exportRowsToExcel({ rows: exportRows, fileName: "camaras", sheetName: "Camaras" })
            }
            onCsv={() => exportRowsToCsv({ rows: exportRows, fileName: "camaras" })}
            disabled={loading || !exportRows.length}
            className="md:self-end"
          />
        </div>
      }
      groupBy={{
        getKey: (camera) => getWarehouseGroupKey(camera),
        getLabel: (camera) => getWarehouse(camera).name,
      }}
      getRowClassName={(row, group) => (group?.isGroupStart ? "border-t-2 border-t-black/5" : "")}
      showColumnFilters={false}
      showPagination={true}
    />
  );
};

export default CamerasTable;
