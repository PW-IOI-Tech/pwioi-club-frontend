import type { Metadata } from "next";
import FlagManagement from "./FlagManagement";

export const metadata: Metadata = {
  title: "Flags Management",
};

export default function Page() {
  return <FlagManagement />;
}
