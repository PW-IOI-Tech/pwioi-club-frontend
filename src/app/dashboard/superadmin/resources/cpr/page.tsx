import type { Metadata } from "next";
import UploadSection from "./UploadSection";

export const metadata: Metadata = {
  title: "CPR Management",
  description: "Upload xls file for CPR",
};

export default function Page() {
  return <UploadSection />;
}
