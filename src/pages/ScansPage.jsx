import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import ViewAgendaOutlinedIcon from "@mui/icons-material/ViewAgendaOutlined";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import CustomSelect from "../components/generic/CustomSelect";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import ScanCards from "../containers/Scans/ScanCards";
import { searchScans } from "../services/scan.service";

const POLLING_INTERVAL = 10000;

// Ajusta esta propiedad al identificador real de tu registro.
const getScanId = (scan) => scan.id ?? scan._id ?? scan.scan_id;

const ScansPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [layoutMode, setLayoutMode] = useState("horizontal");

  const fetchScans = useCallback(async (status = "", showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const result = await searchScans({
        ...(status ? { status } : {}),
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      const newItems = result.data || [];

      setItems((currentItems) => {
        // Primera carga
        if (currentItems.length === 0) {
          return newItems;
        }

        const currentIds = new Set(currentItems.map(getScanId));

        const hasNewRecords = newItems.some(
          (scan) => !currentIds.has(getScanId(scan))
        );

        // Solo actualiza la tabla cuando existan registros nuevos
        return hasNewRecords ? newItems : currentItems;
      });
    } catch (error) {
      console.error("Error fetching scans:", error);

      // Evita mostrar toast cada 10 segundos si falla el polling.
      if (showLoading) {
        toast.error(error?.message || "Error al obtener eventos de escaneo");
        setItems([]);
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // Consulta inicial y al cambiar el filtro
    fetchScans(statusFilter, true);

    // Consulta automática cada 10 segundos
    const intervalId = setInterval(() => {
      fetchScans(statusFilter, false);
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchScans, statusFilter]);

  return (
    <AdminIntroLayout
      title="Escaneos"
      subtitle="Visualiza los eventos de lectura de QR detectados por las cámaras IoT"
      eyebrow={<Breadcrumbs />}
      buttonLabel="Refrescar"
      onCreate={() => fetchScans(statusFilter, true)}
      showAddIcon={false}
    >
      <div className="space-y-6">
        <div className="grid gap-4 ml-auto md:w-[250px]">
          <CustomSelect
            name="scanLayoutMode"
            placeholderLabel="Selecciona un modo de vista"
            value={layoutMode}
            onChange={(event) => setLayoutMode(event.target.value)}
            icon={<ViewAgendaOutlinedIcon />}
            options={[
              { value: "vertical", label: "Vista Vertical" },
              { value: "horizontal", label: "Vista Horizontal" },
            ]}
          />
        </div>

        <ScanCards
          items={items}
          loading={loading}
          layoutMode={layoutMode}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>
    </AdminIntroLayout>
  );
};

export default ScansPage;