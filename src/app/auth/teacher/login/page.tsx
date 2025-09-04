import type { Metadata } from "next";
import LoginPage from "../../LoginPage";

export const metadata: Metadata = {
  title: "Teacher Login",
  description: "Login to your teacher profile",
};

export default function Page() {
  return <LoginPage userType="teacher" />;
}
