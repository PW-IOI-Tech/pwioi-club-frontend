import type { Metadata } from "next";
import UploadSection from "./UploadSection";

export const metadata: Metadata = {
  title: "Marks Management",
  description: "Upload xls file for student marks",
};

export default function Page() {
  return <UploadSection />;
}
