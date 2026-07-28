import { getCurrentUserAction } from "@/lib/actions/authentication_action";
import { AuthProvider } from "@/lib/context";
import { FrontendDataProvider } from "@/lib/context/FrontendDataContext";
import { fetchListings } from "@/lib/api/listing_api";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusCart",
  description: "A student-first marketplace for buying, selling, renting, and trading on campus.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUserAction();
  const listingsResult = await fetchListings();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider initialUser={user}>
          <FrontendDataProvider
            apiListings={listingsResult.success ? listingsResult.data : []}
          >
            {children}
          </FrontendDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
