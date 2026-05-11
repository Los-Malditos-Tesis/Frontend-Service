import GlobalLoader from "../components/generic/GlobalLoader";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "sonner";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <Toaster richColors />
      <GlobalLoader />
      {children}
    </AuthProvider>
  );
}