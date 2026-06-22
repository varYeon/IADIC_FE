import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import ToastProvider from "@/components/common/toast/ToastProvider";
import Header from "@/components/layout/Header";
import Nav from "@/components/layout/Nav";
import "../css/index.css";

const pretendard = localFont({
  src: "../fonts/pretendard/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "훈수톡",
  description: "훈수만을 위한 커뮤니티 및 블로깅 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable}`} suppressHydrationWarning>
      <body className={`${pretendard.className} bg-[#E5E8EB] px-0 antialiased dark:bg-[#272727]`}>
        <ThemeProvider attribute="class">
          <div className="bg-bg-main m-auto flex min-h-dvh w-full max-w-full flex-col rounded-none 2xl:max-w-[1536px] 2xl:rounded-[30px]">
            <Header />
            <div className="flex h-fit flex-1 flex-col sm:flex-row">
              <Nav />
              <main className="scrollbar-hide flex h-[calc(100vh-var(--header-height))] flex-1 rounded-br-[30px] sm:overflow-y-scroll">
                {children}
                <ToastProvider />
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
