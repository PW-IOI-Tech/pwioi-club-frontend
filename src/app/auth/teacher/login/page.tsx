import type { Metadata } from "next";
import LoginPage from "./loginPage";

export const metadata: Metadata = {
  title: "Teacher Login",
  description: "Login to your teacher profile",
};

export default function Page() {
  return <LoginPage />;
}
