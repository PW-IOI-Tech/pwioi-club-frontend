import type { Metadata } from "next";
import CohortManagement from "./DivSemManagement";

export const metadata: Metadata = {
  title: "Division & Semester Management",
};

export default function Page() {
  return <CohortManagement />;
}
