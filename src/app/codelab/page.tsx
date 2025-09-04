import type { Metadata } from "next";
import CodeLabPage from "./CodeLabPage";

export const metadata: Metadata = {
  title: "Coming Soon",
  description: "Code Lab Coming Soon",
};

export default function Page() {
  return <CodeLabPage />;
}
