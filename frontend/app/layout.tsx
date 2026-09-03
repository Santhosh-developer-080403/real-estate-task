import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Citi Estate - Find Your Dream Property in Chennai",
  description:
    "Discover verified apartments, houses, villas, plots, and commercial properties in Chennai with Citi Estate. Connect directly with owners and agents.",
  keywords:
    "real estate chennai, buy apartment chennai, villas in chennai, citi estate, properties for sale chennai, house for rent chennai",
  authors: [{ name: "Dhinesh" }],
  creator: "Citi Estate",
  publisher: "Citi Estate",

  // Open Graph (For Facebook, LinkedIn, WhatsApp previews)
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "#.",
    title: "Citi Estate - Find Your Dream Property in Chennai",
    description:
      "Explore the best residential and commercial properties across Chennai with advanced filters and secure listings.",
    siteName: "Citi Estate",
    images: [
      {
        url: "#.", // உன்னோட இமேஜ் லிங்க் அல்லது பப்ளிக் ஃபோல்டர் பாத்
        width: 1200,
        height: 630,
        alt: "Citi Estate Property Preview",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Citi Estate - Real Estate Platform in Chennai",
    description:
      "Browse verified properties, apartments, and villas easily in Chennai.",
    images: ["#."],
  },

  // Robots & Indexing
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Navbar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
