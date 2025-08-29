import type { Metadata } from "next";
import MarksDashboard from "./MarksDashboard";

export const metadata: Metadata = {
  title: "Marks Dashboard",
};

export default function Page() {
  return <MarksDashboard />;
}
