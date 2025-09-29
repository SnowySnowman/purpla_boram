// src/app/layout.tsx
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Lofi Notes",
  description: "Anonymous, temporary notes with share links",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen">
            <header className="sticky top-0 z-10 border-b border-grape-200 bg-grape-50/80 backdrop-blur">
              <div className="mx-auto max-w-3xl px-4 py-3">
                <h1 className="text-xl font-semibold">Lofi Notes</h1>
              </div>
            </header>
            <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
            <footer className="mx-auto max-w-3xl px-4 py-8 text-sm text-grape-700">
              <p>Made with a lofi purple vibe.</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
