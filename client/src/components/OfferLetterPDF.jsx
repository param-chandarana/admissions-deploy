import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "right",
    fontSize: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
    textDecoration: "underline",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  text: {
    marginBottom: 4,
  },
  table: {
    display: "table",
    width: "auto",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "50%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  tableCell: {
    margin: "auto",
    fontSize: 10,
  },
  footer: {
    fontSize: 10,
    marginTop: 10,
  },
});

const OfferLetterDocument = ({ studentData }) => (
  <Document>
    {/* Page 1 */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text>Ref: {studentData.studentId}</Text>
        <Text>Date: 21st February, 2024</Text>
      </View>

      {/* Title */}
      <View style={styles.title}>
        <Text>
          Provisional Offer Letter to study {studentData.qualification} –
          {studentData.courseOfStudy}
        </Text>
      </View>

      {/* Body Content */}
      <View style={styles.section}>
        <Text>Name: {studentData.studentName}</Text>
        <Text>Country: {studentData.countryName}</Text>
      </View>

      <Text style={styles.text}>Dear {studentData.studentName},</Text>
      <Text style={styles.text}>
        We have received your application to study a full-time Program at
        Marwadi University, Rajkot, Gujarat, India. On behalf of the Marwadi
        University, we are pleased to issue you this Provisional Offer Letter
        for full-time study of {studentData.qualification} –{" "}
        {studentData.courseOfStudy} in Marwadi University for AY 2024-25.
      </Text>

      <Text style={styles.section}>Details of Offered Program:</Text>
      <Text>Program Name: {studentData.qualification}</Text>
      <Text>Duration of Course: {studentData.duration}</Text>
      <Text>Start Date: 01/07/2024</Text>

      {/* Table */}
      <Text style={styles.section}>
        Fee Details of Offered Program (Per Year):
      </Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Total Annual Tuition Fee</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              {studentData.totalAnnualTuitionFee}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Annual Food & Hostel Fee</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              {studentData.hostelMessAndOtherFees}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Total Annual Fee</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{studentData.totalAnnualFees}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              Special Scholarship from Institute
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              {studentData.specialScholarshipFromInstitute}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              Marwadi University President’s Special Scholarship
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              {studentData.MUPresidentsSpecialScholarship}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              Net Annual Fee Payable per Year
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              {studentData.netAnnualFeePayable}
            </Text>
          </View>
        </View>
      </View>

      {/* Acceptance Info */}
      <Text style={styles.section}>
        Fulfill the following Conditions to Accept the Offer of Admission:
      </Text>
      <View>
        <Text>
          • Provide proof of clearance of qualifying examination along with mark
          sheet/degree/certificates as applicable.
        </Text>
        <Text>
          • Submission of either IELTS score of 5.5 Band OR should have studied
          English as a separate subject in Grade 10 or Grade 12.
        </Text>
        <Text>
          • Transfer Advance Registration fee of USD 500 to the Marwadi
          University within the specified date.
        </Text>
        <Text>
          • Fill and submit the duly signed ‘Acceptance of Offer Letter’ along
          with scan copy of payment transfer proof from your bank, to the
          Marwadi University at studyinindia@marwadiuniversity.ac.in.
        </Text>
      </View>

      <Text style={styles.section}>Acceptance Letter (For Visa Purpose):</Text>
      <Text style={styles.text}>
        On receiving the ‘Acceptance of Offer Letter’, we will verify that the
        conditions (if any) have been met and will issue you the ‘Acceptance
        Letter’. The Acceptance Letter can be used to apply for a Student Visa
        in the nearest Indian Embassy/Consulate in your home country. Please
        ensure to apply for the visa in advance as visa process may take 3-6
        weeks.
      </Text>

      <Text style={styles.section}>Important Information:</Text>
      <View>
        <Text>
          1. The student should fill and submit the ‘Acceptance of Offer Letter’
          at the earliest within 10 days of issuing this Offer of Admission.
        </Text>
        <Text>
          2. At the time of reporting (joining) at the Marwadi University, it is
          mandatory for international students to get their
          eligibility/qualifying certificates verified with their originals.
        </Text>
        <Text>
          3. Applicants who are either waiting for the result or appearing for
          the qualifying exam must furnish the result of their qualifying exam.
        </Text>
        <Text>
          4. Students are required to report (join) at the Marwadi University as
          per the schedule of Start of Session.
        </Text>
        <Text>
          5. Submission of an application form or any other document does not
          guarantee admission to any program.
        </Text>
      </View>
    </Page>

    {/* Page 2 */}
    <Page size="A4" style={styles.page}>
      {/* Bank Details */}
      <Text style={styles.section}>Bank Details:</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              Account Name: MEFGI - FACULTY OF ENGINEERING
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Bank Name: BANK OF INDIA</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              Account Number: 313220110000012
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              Branch: MARWADI EDUCATION CAMPUS BRANCH, RAJKOT
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>SWIFT Code: BKIDINBBRAJ</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>IFSC Code: BKID0003132</Text>
          </View>
        </View>
      </View>

      {/* Instructions for International Applicant */}
      <Text style={styles.section}>
        Instructions for International Applicant:
      </Text>
      <View>
        <Text>
          • All International students have to pay their course fee
          semester-wise.
        </Text>
        <Text>
          • Bank charges in case of online transfer of fees will be borne by the
          applicant.
        </Text>
        <Text>
          • Student should confirm the successful transfer of his/her fee by
          sending the scan copy of transaction proof.
        </Text>
      </View>

      <Text style={styles.section}>
        Instructions while Reporting/Joining at the Marwadi University:
      </Text>
      <View>
        <Text>
          1. The student is strongly advised to clear the first semester fee and
          one-year residential fee before joining the Marwadi University.
        </Text>
        <Text>
          2. Document checklist while reporting includes original eligibility
          certificates, mark sheets, passport, medical fitness certificate, etc.
        </Text>
        <Text>
          3. As per government guidelines, an international student must apply
          for FRO within the first 14 days of his/her arrival in India. The
          student should ensure to submit a copy of the FRO certificate to the
          Marwadi University within the stipulated time.
        </Text>
      </View>

      {/* Medical Certification */}
      <Text style={styles.section}>Medical Certification:</Text>
      <View>
        <Text>
          Within 10 days of joining the Marwadi University, a student will have
          to undergo a medical examination as per government of India rules,
          which stipulate that all international students entering India on a
          student visa have to be tested for HIV/Yellow fever/others. In certain
          acute cases, the Marwadi University, if it deems necessary in the
          larger interest, can cancel the admission and ask the student to leave
          the country. In such a case, fees deposited shall be forfeited.
        </Text>
      </View>

      {/* Refund Policy */}
      <Text style={styles.section}>Refund Policy:</Text>
      <View>
        <Text>
          Last day of refund application is 30th November, 2024. One month
          tuition fees and one month hostel + Food fees (if applicable) will be
          deducted.
        </Text>
      </View>

      {/* Closing */}
      <Text style={styles.section}>
        We welcome you at the Marwadi University, Rajkot, Gujarat, India.
      </Text>
      <Text>Best Wishes</Text>
      <Text>International Admissions</Text>
      <Text>Marwadi University</Text>
    </Page>
  </Document>
);

export default OfferLetterDocument;
