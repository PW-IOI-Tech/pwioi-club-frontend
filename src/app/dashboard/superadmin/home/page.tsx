import type { Metadata } from "next";
import AdminHomePageClient from "./AdminHomePageClient";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return <AdminHomePageClient />;
}
