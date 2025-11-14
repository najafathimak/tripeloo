import AdminListPage from "@/components/AdminPanel/AdminListPage";

export default function TripsListPage() {
  return (
    <AdminListPage
      title="Trips"
      type="trips"
      addRoute="/admin/trips"
      editRoutePrefix="/admin/trips/edit"
    />
  );
}

