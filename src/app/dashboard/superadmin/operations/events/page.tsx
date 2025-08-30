import type { Metadata } from "next";
import EventManagement from "./EventManagement";

export const metadata: Metadata = {
  title: "Events Management",
};

export default function Page() {
  return <EventManagement />;
}
