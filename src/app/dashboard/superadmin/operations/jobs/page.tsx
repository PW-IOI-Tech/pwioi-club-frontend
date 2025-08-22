import type { Metadata } from "next";
import JobManagement from "./JobManagement";

export const metadata: Metadata = {
  title: "Jobs Management",
};

export default function Page() {
  return <JobManagement />;
}
