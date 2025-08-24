import type { Metadata } from "next";
import AdminManagement from "./AdminManagement";

export const metadata: Metadata = {
  title: "Mentor Management",
};

export default function Page() {
  return <AdminManagement />;
}
