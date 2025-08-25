import type { Metadata } from "next";
import SchoolManagement from "./SchoolManagement";

export const metadata: Metadata = {
  title: "School Management",
};

export default function Page() {
  return <SchoolManagement />;
}
