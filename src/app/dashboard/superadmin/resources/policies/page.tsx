import type { Metadata } from "next";
import PoliciyManagement from "./PolicyManagement";

export const metadata: Metadata = {
  title: "Policies Management",
};

export default function Page() {
  return <PoliciyManagement />;
}
