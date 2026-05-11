import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Breadcrumbs from "./Breadcrumbs";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fijo */}
      <Sidebar isBlack={false} />

      {/* Content */}
      <div className="flex-1 bg-white flex flex-col">
        <div className="px-6 border-b-2 border-bordercolor py-4">
          <Topbar />
          {/* <Breadcrumbs /> */}
        </div>

        <div className="bg-background flex-1 overflow-y-auto px-6">
          {children}
        </div>
      </div>
    </div>
  );
}