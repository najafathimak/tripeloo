import AdminListPage from "@/components/AdminPanel/AdminListPage";

export default function StaysPage() {
  return (
    <AdminListPage
      title="Stays"
      type="stays"
      addRoute="/admin/stays/add"
      editRoutePrefix="/admin/stays/edit"
    />
  );
}

