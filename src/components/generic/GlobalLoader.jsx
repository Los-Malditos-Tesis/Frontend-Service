import { useAuth } from "../../context/AuthContext";

export default function GlobalLoader() {
  const { loading } = useAuth();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-end p-6">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-black font-medium">Cargando...</p>
      </div>
    </div>
  );
}