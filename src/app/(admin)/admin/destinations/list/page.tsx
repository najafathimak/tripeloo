import AdminListPage from "@/components/AdminPanel/AdminListPage";

export default function DestinationsListPage() {
  return (
    <AdminListPage
      title="Destinations"
      type="destinations"
      addRoute="/admin/destinations"
      editRoutePrefix="/admin/destinations/edit"
    />
  );
}

