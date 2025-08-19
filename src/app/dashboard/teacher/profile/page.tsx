import type { Metadata } from "next";
import TeacherProfileBuilder from "./TeacherProfileBuilder";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your profile",
};

export default function Page() {
  return <TeacherProfileBuilder />;
}
