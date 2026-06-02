import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import ViewAgendaOutlinedIcon from "@mui/icons-material/ViewAgendaOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import CustomSelect from "../components/generic/CustomSelect";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import ScanCards from "../containers/Scans/ScanCards";
import { searchScans } from "../services/scan.service";

const ScansPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [layoutMode, setLayoutMode] = useState("horizontal");

  const fetchScans = useCallback(
    async (status = statusFilter) => {
      try {
        setLoading(true);
        const result = await searchScans({
          ...(status ? { status } : {}),
        });

        if (result.success) {
          setItems(result.data || []);
        } else {
          console.error("Error fetching scans:", result);
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error fetching scans:", error);
        toast.error(error?.message || "Error al obtener eventos de escaneo");
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [statusFilter]
  );

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  return (
    <AdminIntroLayout
      title="Escaneos"
      subtitle="Visualiza los eventos de lectura de QR detectados por las cámaras IoT"
      eyebrow={<Breadcrumbs />}
      buttonLabel="Refrescar"
      onCreate={() => fetchScans(statusFilter)}
      showAddIcon={false}
    >
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <CustomSelect
            name="scanStatusFilter"
            labelText="Filtrar por estado"
            placeholderLabel="Todos los escaneos"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            icon={<FilterAltOutlinedIcon />}
            options={[
              { value: "OK", label: "Buenos" },
              { value: "ERR", label: "Malos" },
            ]}
          />

          <CustomSelect
            name="scanLayoutMode"
            labelText="Vista"
            placeholderLabel="Selecciona un modo de vista"
            value={layoutMode}
            onChange={(event) => setLayoutMode(event.target.value)}
            icon={<ViewAgendaOutlinedIcon />}
            options={[
              { value: "vertical", label: "Vertical" },
              { value: "horizontal", label: "Horizontal" },
            ]}
          />
        </div>

        <ScanCards items={items} loading={loading} layoutMode={layoutMode} />
      </div>
    </AdminIntroLayout>
  );
};

export default ScansPage;
