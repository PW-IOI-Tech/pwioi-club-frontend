import { redirect } from "next/navigation";

interface RoleRedirectProps {
  params: Promise<{role: string}>;
}

export default async function RoleRedirect({ params }: RoleRedirectProps) {
  const { role } = await params;
  const allowedRoles = ["student", "teacher", "admin"];
  const normalizedRole = role.toLowerCase();

  if (allowedRoles.includes(normalizedRole)) {
    redirect(`/auth/${normalizedRole}/login`);
  } else {
    redirect("/");
  }
}
