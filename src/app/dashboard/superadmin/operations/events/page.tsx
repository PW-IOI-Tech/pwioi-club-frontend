import type { Metadata } from "next";
import JobManagement from "./EventManagement";

export const metadata: Metadata = {
  title: "Events Management",
};

export default function Page() {
  return <JobManagement />;
}
