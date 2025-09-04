import type { Metadata } from "next";
import LoginPage from "../../LoginPage";

export const metadata: Metadata = {
  title: "Student Login",
  description: "Login to your student profile",
};

export default function Page() {
  return <LoginPage userType="student"/>;
}
