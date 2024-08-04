import AdminHeader from "@/components/admin/admin-header";
import AdminTable from "@/components/admin/admin-table";

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col text-white">
      <AdminHeader />
      <div className="container py-8">
        <AdminTable />
      </div>
    </div>
  );
}
