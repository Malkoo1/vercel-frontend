import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useState } from "react";

// Set the worker from a CDN (ensure the version matches pdfjs-dist)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const PDFToImage = ({ pdfUrl }) => {
  const [images, setImages] = useState([]);
  const [isPDF, setIsPDF] = useState(true);

  useEffect(() => {
    const convertPDFToImages = async () => {
      try {
        // Check if the URL has a .pdf extension
        if (!pdfUrl.toLowerCase().endsWith(".pdf")) {
          setIsPDF(false); // Not a PDF, treat it as an image
          return;
        }

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
        setIsPDF(false); // Fallback to image if PDF rendering fails
      }
    };

    if (pdfUrl) convertPDFToImages();
  }, [pdfUrl]);

  return (
    <div>
      {isPDF ? (
        images.length > 0 ? (
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
        )
      ) : (
        // Render the URL as an image if it's not a PDF
        <img
          src={pdfUrl}
          alt="Uploaded file"
          className="w-full my-2 rounded-lg shadow-md"
          onError={(e) => {
            e.target.src = "path/to/fallback/image.png"; // Fallback image if the URL is invalid
          }}
        />
      )}
    </div>
  );
};

export default PDFToImage;
