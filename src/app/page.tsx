import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth/student/login");
}
