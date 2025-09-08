import { redirect } from "next/navigation";

export default function RoleRedirect({ params }: { params: { role: string } }) {
  const { role } = params;
  const allowedRoles = ["student", "teacher", "admin"];
  const normalizedRole = role.toLowerCase();

  if (allowedRoles.includes(normalizedRole)) {
    redirect(`/auth/${normalizedRole}/login`);
  } else {
    redirect("/");
  }
}
