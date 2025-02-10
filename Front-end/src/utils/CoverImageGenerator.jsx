import * as pdfjsLib from "pdfjs-dist/webpack";
import pptx2pdf from "pptx2pdf";
import mammoth from "mammoth";
import { jsPDF } from "jspdf";

async function CoverImageGenerator({ setCoverImage, file, fileType }) {
  console.log("File type detected:", fileType); // Log the file type at the start

  // Helper function to render the first page of a PDF to an image
  const renderPdfToImage = async (pdfData) => {
    console.log("Rendering PDF to image...");
    try {
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const context = canvas.getContext("2d");
      if (!context) {
        console.error("Failed to get canvas context.");
        return null;
      }
      await page.render({ canvasContext: context, viewport }).promise;

      const imageUrl = canvas.toDataURL("image/png");
      console.log("PDF rendered to image successfully.");
      return imageUrl;
    } catch (error) {
      console.error("Error rendering PDF to image:", error);
      return null;
    }
  };

  // Helper function to convert DOCX to PDF Blob
  const convertDocxToPdf = async (docxFile) => {
    console.log("Converting DOCX to PDF...");
    try {
      const arrayBuffer = await docxFile.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });

      const doc = new jsPDF();
      doc.text(result.value, 10, 10);
      const pdfBlob = doc.output("blob");
      console.log("DOCX converted to PDF successfully.");
      return pdfBlob;
    } catch (error) {
      console.error("Error converting DOCX to PDF:", error);
      return null;
    }
  };

  // Handle PDF files
  if (fileType === "application/pdf") {
    console.log("Handling a PDF file...");
    const reader = new FileReader();

    reader.onload = async (event) => {
      console.log("PDF file loaded successfully.");
      try {
        const pdfData = event.target.result;
        const coverImage = await renderPdfToImage(pdfData);
        if (coverImage) {
          console.log("PDF cover image set successfully.");
          setCoverImage(coverImage);
        } else {
          console.warn("Failed to generate cover image from PDF.");
          setCoverImage(null);
        }
      } catch (error) {
        console.error("Error processing PDF file:", error);
        setCoverImage(null);
      }
    };

    reader.onerror = () => {
      console.error("Error reading the PDF file.");
      setCoverImage(null);
    };

    reader.readAsArrayBuffer(file);

    // Handle PPT files
  } else if (
    fileType === "application/vnd.ms-powerpoint" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    console.log("Handling a PPT file...");
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const pptData = event.target.result;
        const pptx = await pptx2pdf(pptData);
        if (pptx.firstSlideImage) {
          console.log("PPT cover image set successfully.");
          setCoverImage(pptx.firstSlideImage);
        } else {
          console.warn("Failed to generate cover image from PPT.");
          setCoverImage(null);
        }
      } catch (error) {
        console.error("Error converting PPT to image:", error);
        setCoverImage(null);
      }
    };

    reader.onerror = () => {
      console.error("Error reading the PPT file.");
      setCoverImage(null);
    };

    reader.readAsArrayBuffer(file);

    // Handle DOCX files
  } else if (
    fileType === "application/msword" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    console.log("Handling a DOCX file...");
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const docxFile = event.target.result;
        const pdfBlob = await convertDocxToPdf(file);
        if (pdfBlob) {
          const pdfData = await pdfBlob.arrayBuffer();
          const coverImage = await renderPdfToImage(pdfData);
          if (coverImage) {
            console.log("DOCX cover image set successfully.");
            setCoverImage(coverImage);
          } else {
            console.warn("Failed to generate cover image from DOCX.");
            setCoverImage(null);
          }
        } else {
          console.warn("Failed to convert DOCX to PDF.");
          setCoverImage(null);
        }
      } catch (error) {
        console.error("Error processing DOCX file:", error);
        setCoverImage(null);
      }
    };

    reader.onerror = () => {
      console.error("Error reading the DOCX file.");
      setCoverImage(null);
    };

    reader.readAsArrayBuffer(file);

    // Unsupported file types
  } else {
    console.warn("Unsupported file type:", fileType);
    setCoverImage(null);
  }
}

export default CoverImageGenerator;
