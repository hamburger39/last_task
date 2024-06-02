import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="p-4">
        <div className="flex justify-center text-xl my-10">
          TODOリスト
          </div>
          {children}
          </body>
    </html>
  );
}
