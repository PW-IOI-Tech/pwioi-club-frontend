import type { Metadata } from "next";
import ExamManagement from "./ExamManagement";

export const metadata: Metadata = {
  title: "Exam Management",
};

export default function Page() {
  return <ExamManagement />;
}
