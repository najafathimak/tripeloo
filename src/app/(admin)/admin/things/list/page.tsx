import AdminListPage from "@/components/AdminPanel/AdminListPage";

export default function ThingsListPage() {
  return (
    <AdminListPage
      title="Things to Do"
      type="activities"
      addRoute="/admin/things"
      editRoutePrefix="/admin/things/edit"
    />
  );
}

