import type { Metadata } from "next";
import RoomManagement from "./RoomManagement";

export const metadata: Metadata = {
  title: "Policies Management",
};

export default function Page() {
  return <RoomManagement />;
}
