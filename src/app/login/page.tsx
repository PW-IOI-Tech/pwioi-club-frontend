import type { Metadata } from "next";
import LoginPage from "./loginPage";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your student profile",
};

export default function Page() {
  return <LoginPage />;
}
