import type { Metadata } from "next";
import CPRManagement from "./CPRSection";

export const metadata: Metadata = {
  title: "CPR Management",
  description: "Manage CPR for your subjects",
};

export default function Page() {
  return <CPRManagement />;
}
