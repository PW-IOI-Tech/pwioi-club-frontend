import TeacherHomePageClient from "./TeacherHomePageClient";

export const metadata = {
  title: "Teacher Dashboard",
  description:
    "Manage your classes, view student progress, and update your profile.",
};

export default function TeacherPage() {
  return <TeacherHomePageClient />;
}
