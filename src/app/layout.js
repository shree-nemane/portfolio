import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PageTransitionProvider } from "../components/PageTransition";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.CF_PAGES_URL ||
    "https://shreenemane.pages.dev"
  ),
  title: {
    default: "Shree Nemane — Creative Developer & Software Engineer",
    template: "%s | Shree Nemane",
  },
  description:
    "Portfolio of Shree Nemane — Creative Developer building high-performance web applications, mobile platforms, desktop tools, and forensic AI systems. Your idea, built and shipped.",
  keywords: [
    "Shree Nemane",
    "Creative Developer",
    "Full-Stack Developer",
    "Software Engineer",
    "React",
    "Next.js",
    "Tailwind CSS",
    "React Native",
    "Tauri",
    "Rust",
    "Python",
    "Web Development",
    "Mobile App Development",
    "Portfolio",
    "Frontend Engineer",
  ],
  authors: [{ name: "Shree Nemane", url: "https://shreenemane.pages.dev" }],
  creator: "Shree Nemane",
  publisher: "Shree Nemane",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shreenemane.pages.dev",
    siteName: "Shree Nemane Portfolio",
    title: "Shree Nemane — Creative Developer & Software Engineer",
    description:
      "Your idea, built and shipped. High-performance web applications, mobile platforms, and desktop tools.",
    images: [
      {
        url: "/shree-standing.png",
        width: 688,
        height: 688,
        alt: "Shree Nemane — Creative Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shree Nemane — Creative Developer & Software Engineer",
    description:
      "Your idea, built and shipped. High-performance web applications, mobile platforms, and desktop tools.",
    images: ["/shree-standing.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://shreenemane.pages.dev/#person",
      name: "Shree Nemane",
      url: "https://shreenemane.pages.dev",
      jobTitle: "Creative Developer & Software Engineer",
      sameAs: [
        "https://github.com/shree-nemane",
        "https://www.linkedin.com/in/shreedarshan-nemane-455417329",
      ],
      email: "mailto:shreenemane06@gmail.com",
      description:
        "Creative Developer engineering high-performance web applications, mobile apps, desktop systems, and machine learning models.",
    },
    {
      "@type": "WebSite",
      "@id": "https://shreenemane.pages.dev/#website",
      url: "https://shreenemane.pages.dev",
      name: "Shree Nemane — Creative Developer",
      publisher: {
        "@id": "https://shreenemane.pages.dev/#person",
      },
      inLanguage: "en-US",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
