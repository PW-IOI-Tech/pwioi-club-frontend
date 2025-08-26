import type { Metadata } from "next";
import ClassManagement from "./ClassManagement";

export const metadata: Metadata = {
  title: "Class Management",
};

export default function Page() {
  return <ClassManagement />;
}
