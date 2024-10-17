import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

const OfferLetterDocument = ({ studentData }) => (
  <Document>
    <Page size="A4">
      <View>
        <Text>Student ID: {studentData.studentId}</Text>
        <Text>Student Name: {studentData.studentName}</Text>
        <Text>Country: {studentData.countryName}</Text>
        <Text>Qualification: {studentData.qualification}</Text>
        <Text>Course of Study: {studentData.courseOfStudy}</Text>
        <Text>Duration: {studentData.duration}</Text>
        <Text>
          Total Annual Tuition Fee: {studentData.totalAnnualTuitionFee}
        </Text>
        <Text>
          Hostel, Mess, and Other Fees: {studentData.hostelMessAndOtherFees}
        </Text>
        <Text>Total Annual Fees: {studentData.totalAnnualFees}</Text>
        <Text>
          Special Scholarship: {studentData.specialScholarshipFromInstitute}
        </Text>
        <Text>
          MUP President's Special Scholarship:{" "}
          {studentData.MUPresidentsSpecialScholarship}
        </Text>
        <Text>Net Annual Fee Payable: {studentData.netAnnualFeePayable}</Text>
      </View>
    </Page>
  </Document>
);

const OfferLetterButton = ({ studentData }) => {
  const fileName = studentData.studentId
    .substring(studentData.studentId.length - 3)
    .replace(/^0+/, ""); // Remove leading zeroes

  return (
    <PDFDownloadLink
      document={<OfferLetterDocument studentData={studentData} />}
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
