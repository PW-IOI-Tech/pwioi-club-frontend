import type { Metadata } from "next";
import TeacherHome from "./TeacherHome";

export const metadata: Metadata = {
  title: "Teacher Profile",
  description: "Manage your teacher profile",
};

export default function Page() {
  return <TeacherHome />;
}
