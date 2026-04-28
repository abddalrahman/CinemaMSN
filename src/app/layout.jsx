import { Geist, Geist_Mono, Roboto, Quicksand } from "next/font/google";
import 'swiper/css'; 
import 'swiper/css/navigation'
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./componentes/global/header/Header";
import { ToastContainer } from "react-toastify";
import Footer from "./componentes/global/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata = {
  title: "CinemaMSN - Home",
  description: `Discover the world of cinema with CinemaMSN. Explore the latest movies, TV series, celebrity news, and top-rated rankings
   all in one place.`,
  icons: {
    icon: "/images/icon-01.png"
  },
  openGraph: {
    title: "CinemaMSN - Home",
    description: `Discover the world of cinema with CinemaMSN. Explore the latest movies, TV series, celebrity news, and top-rated rankings 
    all in one place.`,
    type: "website",
    images: [
      {
        url: "/images/icon-01.png",
        width: 800,
        height: 800,
        alt: "CinemaMSN Logo",
      },
    ],
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable}`}>
        <Header/>
        <ToastContainer theme="colored" position="top-center" style={{zIndex: 10000000}}/>
        <main>
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
