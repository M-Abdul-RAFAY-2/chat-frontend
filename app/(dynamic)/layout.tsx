import TopNavigation from "@/components/TopNavigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TopNavigation />
        {children}
      </body>
    </html>
  );
}
