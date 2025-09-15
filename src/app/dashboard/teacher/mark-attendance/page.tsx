import type { Metadata } from "next";
import AttendanceTracker from "./AttendancePortal";

export const metadata: Metadata = {
  title: "Attendance",
  description: "View your semester and coursewise attendance details",
};

export default function Page() {
  return <AttendanceTracker />;
}
