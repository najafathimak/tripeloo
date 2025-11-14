import AdminListPage from "@/components/AdminPanel/AdminListPage";

export default function DestinationsPage() {
  return (
    <AdminListPage
      title="Destinations"
      type="destinations"
      addRoute="/admin/destinations/add"
      editRoutePrefix="/admin/destinations/edit"
    />
  );
}
