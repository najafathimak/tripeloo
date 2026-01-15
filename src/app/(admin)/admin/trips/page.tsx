import AdminListPage from "@/components/AdminPanel/AdminListPage";

export default function TripsPage() {
  return (
    <AdminListPage
      title="Restaurants & Cafes"
      type="trips"
      addRoute="/admin/trips/add"
      editRoutePrefix="/admin/trips/edit"
    />
  );
}
