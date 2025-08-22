import type { Metadata } from "next";
import MentorManagement from "./MentorManagement";

export const metadata: Metadata = {
  title: "Mentor Management",
};

export default function Page() {
  return <MentorManagement />;
}
