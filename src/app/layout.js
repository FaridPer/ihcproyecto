import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from 'next';
 
export const metadata = {
  title: 'Buscador de libros',
};
 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
