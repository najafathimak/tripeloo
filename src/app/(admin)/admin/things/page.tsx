import AdminListPage from "@/components/AdminPanel/AdminListPage";

export default function ThingsPage() {
  return (
    <AdminListPage
      title="Things to Do"
      type="activities"
      addRoute="/admin/things/add"
      editRoutePrefix="/admin/things/edit"
    />
  );
}
