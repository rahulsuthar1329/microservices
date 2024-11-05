import { useState } from "react";
import Papa from "papaparse";
import pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFToCSV = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [csvData, setCsvData] = useState([]);

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const parsePDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const csvRows = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      csvRows.push(pageText);
    }

    // Process the text to extract table data
    const tableData = csvRows.map((row) =>
      row.split(/\s+/).filter((cell) => cell !== "")
    );

    setCsvData(tableData);
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "converted.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={() => parsePDF(pdfFile)}>Convert to CSV</button>
      <button onClick={downloadCSV}>Download CSV</button>
    </div>
  );
};

export default PDFToCSV;
