// src/app/layout.tsx
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Purpla",
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
                <h1 className="text-xl font-semibold">Purpla</h1>
              </div>
            </header>
            <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
            <footer className="mx-auto max-w-3xl px-4 py-8 text-sm text-grape-700">
              <p>Made by <a href="https://www.linkedin.com/in/minjung-shin-187565222/">Luna Shin</a></p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
