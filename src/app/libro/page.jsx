"use client";
import { useSearchParams } from "next/navigation";
import { Viewer, Worker } from "@react-pdf-viewer/core";

export default function Libro() {
  const searchParams = useSearchParams();
  const archivo = searchParams.get("archivo"); // Obtener el archivo desde la URL

  if (!archivo) {
    return <p>No se ha proporcionado un archivo PDF</p>;
  }

  return (
    <main>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        <div >
          <Viewer fileUrl={`/libros/${archivo}`} />
        </div>
      </Worker>
    </main>
  );
}
