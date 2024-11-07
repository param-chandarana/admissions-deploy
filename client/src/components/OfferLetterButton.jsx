import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import OfferLetterPDF from "./OfferLetterPDF";

const OfferLetterButton = ({ studentData }) => {
  const fileName = studentData.studentId
    .substring(studentData.studentId.length - 3)
    .replace(/^0+/, ""); // Remove leading zeroes

  return (
    <PDFDownloadLink
      document={<OfferLetterPDF studentData={studentData} />}
      fileName={`${fileName}.pdf`}
      style={{ textDecoration: "none" }}
    >
      {({ blob, url, loading, error }) => (
        <button
          className="btn btn-offer-letter px-1"
          data-bs-toggle="tooltip"
          onClick={() => {
            if (loading) {
              toast.info("Generating offer letter...");
            } else if (error) {
              toast.error("Error generating offer letter");
            } else {
              toast.success("Offer letter generated successfully");
            }
          }}
          disabled={loading}
        >
          <FontAwesomeIcon icon={faFile} />
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default OfferLetterButton;
