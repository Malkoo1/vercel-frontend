import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useState } from "react";

// Set the worker from a CDN (ensure the version matches pdfjs-dist)
// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js"; // Use the correct version

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const PDFToImage = ({ pdfUrl }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const convertPDFToImages = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const numPages = pdf.numPages;
        let imageUrls = [];

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const scale = 2; // Adjust scale for better quality
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;
          imageUrls.push(canvas.toDataURL("image/png")); // Convert to base64 PNG
        }

        setImages(imageUrls);
      } catch (error) {
        console.error("Error converting PDF to images:", error);
      }
    };

    if (pdfUrl) convertPDFToImages();
  }, [pdfUrl]);

  return (
    <div>
      {images.length > 0 ? (
        images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Page ${index + 1}`}
            className="w-full my-2 rounded-lg shadow-md"
          />
        ))
      ) : (
        <p>Loading PDF pages...</p>
      )}
    </div>
  );
};

export default PDFToImage;
