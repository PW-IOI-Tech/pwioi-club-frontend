import type { Metadata } from "next";
import AttendanceDashboard from "./AttendanceDashboard";

export const metadata: Metadata = {
  title: "Attendance Dashboard",
};

export default function Page() {
  return <AttendanceDashboard />;
}
