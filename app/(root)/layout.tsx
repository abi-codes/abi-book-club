import "../globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Bottombar from "@/components/shared/Bottombar";
import { dark } from "@clerk/themes";
import { MyThemeContextProvider } from "@/store/ThemeContext";
import { Toaster } from "@/components/ui/toaster";

import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Abi's Book Club",
  description: "A cutting edge literature networking platform",
  image: "/public/assets/home-page.jpeg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MyThemeContextProvider>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        <html lang="en">
          <Head>
            <title>{metadata.title}</title>
            <meta name="description" content={metadata.description} />
            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={metadata.title} />
            <meta property="og:description" content={metadata.description} />
            <meta property="og:image" content={metadata.image} />
            <meta property="og:image:width" content="300" />
            <meta property="og:image:height" content="300" />
            <meta property="og:url" content="https://www.abibookclub.com/" />
            {/* You can add more OG tags as needed */}
            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={metadata.title} />
            <meta name="twitter:description" content={metadata.description} />
            <meta name="twitter:image" content={metadata.image} />
          </Head>
          <body className={inter.className}>
            <Topbar />
            <main className="flex flex-row">
              <LeftSidebar />

              <section className="main-container">
                <div className="w-full max-w-4xl">{children}</div>
              </section>

              <RightSidebar />
            </main>

            <Bottombar />
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    </MyThemeContextProvider>
  );
}
