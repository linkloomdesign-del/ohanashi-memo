import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "おはなしメモ（家族）",
  description: "おはなしメモ 家族管理画面",
  manifest: "/manifest-family.json",
};

export const viewport: Viewport = {
  themeColor: "#4A90D9",
};

export default function FamilyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
