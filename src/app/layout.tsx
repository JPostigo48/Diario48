import type { Metadata } from "next";
import { JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Diario48",
  description:
    "Plataforma personal de herramientas, proyectos y experimentos de computación.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-theme="dark"
      className={`${sora.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Aplica el tema guardado antes del primer paint para evitar flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('d48-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full overflow-hidden bg-[var(--d48-bg)] font-sans text-[var(--d48-text)]">
        {children}
      </body>
    </html>
  );
}
