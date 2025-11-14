import AdminListPage from "@/components/AdminPanel/AdminListPage";

export default function StaysListPage() {
  return (
    <AdminListPage
      title="Stays"
      type="stays"
      addRoute="/admin/stay"
      editRoutePrefix="/admin/stay/edit"
    />
  );
}

