import "./globals.css";

export const metadata = {
  title: "EGA Autonomous AI Edge",
  description: "AI Edge Orchestration Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
