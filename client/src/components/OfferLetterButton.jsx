import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

const OfferLetterButton = ({ studentData }) => {
  const handleGenerateOfferLetter = async () => {
    try {
      // Extract last three characters of studentId
      const studentId = studentData.studentId;
      const fileName = studentId
        .substring(studentId.length - 3)
        .replace(/^0+/, ""); // Remove leading zeroes

      // Send request to server to generate offer letter
      const response = await axios.post(
        `/api/pdf/generate`,
        studentData,
        {
          responseType: "blob", // Receive response as a Blob
        }
      );

      // Create a blob URL for the PDF
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);

      // Initiate download for the PDF with modified file name
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success toast
      toast.success("Offer letter generated successfully");
    } catch (error) {
      // console.error('Error generating offer letter:', error);
      // Show error toast
      toast.error("Error generating offer letter");
    }
  };

  return (
    <button
      className="btn btn-offer-letter px-1"
      data-bs-toggle="tooltip" title="Generate Offer Letter"
      onClick={handleGenerateOfferLetter}
    >
      <FontAwesomeIcon icon={faFile} />
    </button>
  );
};

export default OfferLetterButton;
