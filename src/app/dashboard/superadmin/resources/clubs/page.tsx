import type { Metadata } from "next";
import ClubManagement from "./ClubManagement";

export const metadata: Metadata = {
  title: "Clubs Management",
};

export default function Page() {
  return <ClubManagement />;
}
