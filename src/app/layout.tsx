import type { Metadata } from "next";
import { geistMono, paperlogy } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusBrain — Physical AI Campus Operating System",
  description:
    "공간이 사람을 이해하는 순간. AI가 캠퍼스를 보고, 상황을 예측하고, 공간을 움직입니다. (Interactive prototype)",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      data-scroll-behavior="smooth"
      className={`${paperlogy.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
