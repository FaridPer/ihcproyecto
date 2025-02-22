import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from 'next';
 
export const metadata = {
  title: 'Buscador de libros',
};
 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" type="image/svg-xml" href="/libro.svg" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
