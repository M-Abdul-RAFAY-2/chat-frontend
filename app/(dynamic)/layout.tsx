import TopNavigation from "@/components/TopNavigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col overflow-hidden">
        <div className="flex-shrink-0" style={{ height: 56 }}>
          <TopNavigation />
        </div>
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}