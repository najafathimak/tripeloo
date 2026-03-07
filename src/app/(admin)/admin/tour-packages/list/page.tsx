import AdminListPage from "@/components/AdminPanel/AdminListPage";

export default function TourPackagesListPage() {
  return (
    <AdminListPage
      title="Tour Packages"
      type="tour-packages"
      addRoute="/admin/tour-packages/add"
      editRoutePrefix="/admin/tour-packages/edit"
    />
  );
}
