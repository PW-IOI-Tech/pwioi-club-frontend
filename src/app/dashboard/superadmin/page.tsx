import AdminFeed from "./Feed";

export const metadata = {
  title: "Admin Dashboard",
  description:
    "Manage admins, teachers, students, academic structure, operations, and resources from one central dashboard.",
};

export default function AdminPage() {
  return <AdminFeed />;
}
