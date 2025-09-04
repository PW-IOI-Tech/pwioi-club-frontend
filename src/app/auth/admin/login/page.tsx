import type { Metadata } from "next";
import LoginPage from "../../LoginPage";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Login to your admin profile",
};

export default function Page() {
  return <LoginPage userType="admin" />;
}
