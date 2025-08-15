import type { Metadata } from "next";
import StudentProfileBuilder from "./StudentProfileBuilder";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your profile",
};

export default function Page() {
  return <StudentProfileBuilder />;
}
