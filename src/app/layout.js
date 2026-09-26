import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PageTransitionProvider } from "../components/PageTransition";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Portfolio | Creative Visuals & Digital Experiences",
  description: "Multidisciplinary designer focused on creating bold visual identities and digital experiences for brands & tech products.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
