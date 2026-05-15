import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import ScanCards from "../containers/Scans/ScanCards";
import { searchScans } from "../services/scan.service";

const ScansPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScans = async () => {
    try {
      setLoading(true);
      const result = await searchScans();

      if (result.success) {
        setItems(result.data || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching scans:", error);
      toast.error(error?.message || "Error al obtener eventos de escaneo");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  return (
    <AdminIntroLayout
      title="Escaneos"
      subtitle="Visualiza los eventos de lectura de QR detectados por las cámaras IoT"
      eyebrow={<Breadcrumbs />}
      buttonLabel="Refrescar"
      onCreate={fetchScans}
      showAddIcon={false}
    >
      <div className="space-y-6">
        <ScanCards items={items} loading={loading} />
      </div>
    </AdminIntroLayout>
  );
};

export default ScansPage;
