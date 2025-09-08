import StudentHomePageClient from "./StudentHomePageClient";

export const metadata = {
  title: "Student Dashboard",
  description:
    "View and manage your student profile, courses, and community across PWIOI.",
};

export default function StudentPage() {
  return <StudentHomePageClient />;
}
