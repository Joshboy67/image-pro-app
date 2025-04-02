import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Support | ImagePro",
  description: "Get help and support for using ImagePro's image processing features",
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 