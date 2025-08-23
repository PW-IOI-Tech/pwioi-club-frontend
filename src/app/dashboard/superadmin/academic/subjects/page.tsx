import type { Metadata } from "next";
import SubjectManagement from "./SubjectManagement";

export const metadata: Metadata = {
  title: "Subject Management",
};

export default function Page() {
  return <SubjectManagement />;
}
