import type { Metadata } from "next";
import StudentHome from "./StudentHome";

export const metadata: Metadata = {
  title: "Student Profile",
  description: "Manage your student profile",
};

export default function Page() {
  return <StudentHome />;
}
