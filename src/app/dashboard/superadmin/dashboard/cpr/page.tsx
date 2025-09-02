import type { Metadata } from "next";
import CPRDashboard from "./CPRDashboard";

export const metadata: Metadata = {
  title: "CPR Dashboard",
};

export default function Page() {
  return <CPRDashboard />;
}
