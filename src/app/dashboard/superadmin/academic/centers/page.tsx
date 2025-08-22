import type { Metadata } from "next";
import CenterManagement from "./CenterManagement";

export const metadata: Metadata = {
  title: "Center Management",
};

export default function Page() {
  return <CenterManagement />;
}
