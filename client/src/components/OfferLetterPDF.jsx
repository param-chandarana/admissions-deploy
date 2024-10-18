import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 7.370079,
    paddingBottom: 38.83465,
    paddingLeft: 49.6063,
    paddingRight: 40.53543,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: 700,
    fontFamily: "Times-Bold",
  },
  section: {
    marginTop: 10,
    fontWeight: 700,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.2,
  },
  sectionUnderline: {
    marginTop: 10,
    fontWeight: 700,
    fontFamily: "Helvetica-Bold",
    textDecoration: "underline",
    lineHeight: 1.2,
  },
  text: {
    textAlign: "justify",
    fontSize: 9,
    lineHeight: 1.2,
    wordBreak: "break-word",
    hyphens: "none",
  },
  table: {
    display: "table",
    width: "auto",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColSmall: {
    width: "25%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  tableCol: {
    width: "50%",
    padding: 4,
  },
  tableColListIcon: {
    width: "3%",
    textAlign: "right",
  },
  tableColListContent: {
    paddingLeft: 4,
    width: "96%",
  },
  tableCell: {
    textAlign: "left",
    fontSize: 9,
  },
  footer: {
    fontSize: 10,
    marginTop: 10,
  },
  textBold: {
    fontWeight: 700,
    textAlign: "justify",
    fontFamily: "Helvetica-Bold",
    wordBreak: "normal",
    hyphens: "none",
    lineHeight: 1.2,
  },
  textBoldUnderline: {
    fontWeight: 700,
    textAlign: "justify",
    fontFamily: "Helvetica-Bold",
    textDecoration: "underline",
    wordBreak: "normal",
    hyphens: "none",
    lineHeight: 1.2,
  },
  marginBottom: {
    marginBottom: 10,
  },
});

const OfferLetterDocument = ({ studentData }) => (
  <Document>
    {/* Page 1 */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Ref: {studentData.studentId}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Date: 21st February, 2024</Text>
          </View>
        </View>
      </View>

      {/* Title */}
      <View style={styles.title}>
        <Text>
          Subject: Provisional Offer Letter to study {studentData.qualification}{" "}
          – {studentData.courseOfStudy}
        </Text>
      </View>

      {/* Body Content */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Name</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              :{"   "}
              {studentData.studentName}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Country</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              :{"   "}
              {studentData.countryName}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.marginBottom}></Text>
      <Text style={styles.marginBottom}></Text>

      <Text style={styles.textBold}>Dear {studentData.studentName},</Text>
      <Text style={styles.marginBottom}></Text>
      <Text style={styles.text}>
        We have received your application to study a full-time Program at
        Marwadi University, Rajkot, Gujarat, India. On behalf of the Marwadi
        University, we are pleased to issue you this Provisional{" "}
        <Text style={styles.textBold}>Offer Letter</Text> for full-time study of{" "}
        <Text style={styles.textBold}>
          {studentData.qualification} – {studentData.courseOfStudy}
        </Text>{" "}
        in{" "}
        <Text style={styles.textBold}>Marwadi University for AY 2024-25.</Text>
      </Text>

      <Text style={styles.section}>Details of Offered Program:</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Program Name</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              :{"   "}
              {studentData.qualification}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Duration of Course</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              :{"   "}
              {studentData.duration}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Start Date</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>:{"   "}01/07/2024</Text>
          </View>
        </View>
      </View>

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
              <Text style={styles.textBold}>
                Net Annual Fee Payable per Year
              </Text>
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              <Text style={styles.textBold}>
                {studentData.netAnnualFeePayable}
              </Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Acceptance Info */}
      <Text style={styles.sectionUnderline}>
        Fulfill the following Conditions to Accept the Offer of Admission:
      </Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColListIcon}>
            <Text style={styles.text}>•</Text>
          </View>
          <View style={styles.tableColListContent}>
            <Text style={styles.text}>
              Provide proof of clearance of qualifying examination along with
              mark sheet/degree/certificates as applicable.
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableColListIcon}>
            <Text style={styles.text}>•</Text>
          </View>
          <View style={styles.tableColListContent}>
            <Text style={styles.text}>
              Submission of either IELTS score of 5.5 Band{" "}
              <Text style={styles.textBold}>Or</Text> should have studied
              English as a separate subject in Grade 10 or Grade 12.
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableColListIcon}>
            <Text style={styles.text}>•</Text>
          </View>
          <View style={styles.tableColListContent}>
            <Text style={styles.text}>
              Transfer{" "}
              <Text style={styles.textBold}>Advance Registration fee</Text> of{" "}
              <Text style={styles.textBold}>USD 500</Text> to the Marwadi
              University within the specified date.
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableColListIcon}>
            <Text style={styles.text}>•</Text>
          </View>
          <View style={styles.tableColListContent}>
            <Text style={styles.text}>
              Fill and submit the duly signed ‘Acceptance of Offer Letter’ along
              with scan copy of payment transfer proof from your bank, to the
              Marwadi University at{" "}
              <Text style={styles.textBold}>
                studyinindia@marwadiuniversity.ac.in.
              </Text>
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionUnderline}>
        Acceptance Letter (For Visa Purpose):
      </Text>
      <Text style={styles.text}>
        On receiving the ‘Acceptance of Offer Letter’, we will verify that the
        conditions (if any) have been met and will issue you the {"\n"}‘
        <Text style={styles.textBold}>Acceptance Letter</Text>’. The Acceptance
        Letter can be used to apply for a Student Visa in the nearest Indian
        Embassy/Consulate in your home country.{" "}
        <Text style={styles.textBold}>
          Please ensure to apply for the visa in advance as visa process may
          take 3-6 weeks.
        </Text>
      </Text>

      <Text style={styles.section}>Important Information:</Text>
      <Text style={styles.marginBottom}></Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColListIcon}>
            <Text style={styles.text}>1.)</Text>
          </View>
          <View style={styles.tableColListContent}>
            <Text style={styles.text}>
              The student should fill and submit the ‘Acceptance of Offer
              Letter’ at the earliest within{" "}
              <Text style={styles.textBold}>10 days</Text> of issuing this Offer
              of Admission. Any extension or delay in payment of advance fee
              shall be informed to International Department of the Marwadi
              University through e mail at:{" "}
              <Text style={styles.textBoldUnderline}>
                studyinindia@marwadiuniversity.ac.in
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableColListIcon}>
            <Text style={styles.text}>2.)</Text>
          </View>
          <View style={styles.tableColListContent}>
            <Text style={styles.text}>
              At the time of reporting (joining) at the Marwadi University, it
              is mandatory for international students to get their
              eligibility/qualifying certificates verified with their originals.
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableColListIcon}>
            <Text style={styles.text}>3.)</Text>
          </View>
          <View style={styles.tableColListContent}>
            <Text style={styles.text}>
              Applicants who are either waiting for the result or appearing for
              the qualifying exam must furnish the result of their qualifying
              exam.
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableColListIcon}>
            <Text style={styles.text}>4.)</Text>
          </View>
          <View style={styles.tableColListContent}>
            <Text style={styles.text}>
              Students are required to report (join) at the Marwadi University
              as per the schedule of Start of Session.
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableColListIcon}>
            <Text style={styles.text}>5.)</Text>
          </View>
          <View style={styles.tableColListContent}>
            <Text style={styles.text}>
              Submission of application form or any other document or generation
              of Offer Letter and Registration Number etc. does not guarantee
              admission to any Program.
            </Text>
          </View>
        </View>
      </View>
      {/* <View>
        <Text style={styles.text}>
          1.) The student should fill and submit the ‘Acceptance of Offer
          Letter’ at the earliest within{" "}
          <Text style={styles.textBold}>10 days</Text> of issuing this Offer of
          Admission. Any extension or delay in payment of advance fee shall be
          informed to International Department of the Marwadi University through
          e mail at:{" "}
          <Text style={styles.textBoldUnderline}>
            studyinindia@marwadiuniversity.ac.in
          </Text>
        </Text>
        <Text style={styles.text}>
          2.) At the time of reporting (joining) at the Marwadi University, it
          is mandatory for international students to get their
          eligibility/qualifying certificates verified with their originals.
        </Text>
        <Text style={styles.text}>
          3.) Applicants who are either waiting for the result or appearing for
          the qualifying exam must furnish the result of their qualifying exam.
        </Text>
        <Text style={styles.text}>
          4.) Students are required to report (join) at the Marwadi University
          as per the schedule of Start of Session.
        </Text>
        <Text style={styles.text}>
          5.) Submission of application form or any other document or generation
          of Offer Letter and Registration Number etc. does not guarantee
          admission to any Program.
        </Text>
      </View> */}
    </Page>

    {/* Page 2 */}
    <Page size="A4" style={styles.page}>
      {/* Bank Details */}
      <Text style={styles.sectionUnderline}>Bank Details:</Text>
      <Text style={styles.marginBottom}></Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColSmall}>
            <Text style={styles.tableCell}>Beneficiary Details</Text>
          </View>
          <View style={styles.tableColSmall}>
            <Text style={styles.tableCell}>Bank Name</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>BANK OF INDIA</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableColSmall}>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={styles.tableColSmall}>
            <Text style={styles.tableCell}>Account Name:</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>MEFGI - FACULTY OF ENGINEERING</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableColSmall}>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={styles.tableColSmall}>
            <Text style={styles.tableCell}>Account Number:</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>313220110000012</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableColSmall}>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={styles.tableColSmall}>
            <Text style={styles.tableCell}>Branch:</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              MARWADI EDUCATION CAMPUS BRANCH, RAJKOT
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableColSmall}>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={styles.tableColSmall}>
            <Text style={styles.tableCell}>SWIFT Code</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>BKIDINBBRAJ</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableColSmall}>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={styles.tableColSmall}>
            <Text style={styles.tableCell}>ISFC Code:</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>BKID0003132</Text>
          </View>
        </View>
      </View>

      {/* Instructions for International Applicant */}
      <Text style={styles.sectionUnderline}>
        Instructions for International Applicant:
      </Text>
      <Text style={styles.marginBottom}></Text>
      <View>
        <Text style={styles.text}>
          • All International students have to pay their course fee
          semester-wise.
        </Text>
        <Text style={styles.text}>
          • Bank charges, in case online transfer of fee, will be borne by the
          applicant. The Marwadi University will credit the same amount which
          will be received in its account. The student will have to deposit the
          balance in case of any difference in the amount received by the
          Marwadi University in its bank account.
        </Text>
        <Text style={styles.text}>
          • Student should confirm the successful transfer of his/her fee by
          sending the scan copy of transaction proof through e mail at:
          <Text style={styles.textBold}>
            studyinindia@marwadiuniversity.ac.in
          </Text>{" "}
          and shall retain original proof of the fee transferred and produce it
          while reporting at the Marwadi University
        </Text>
      </View>

      <Text style={styles.sectionUnderline}>
        Instructions while Reporting/Joining at the Marwadi University:
      </Text>
      <View>
        <Text style={styles.text}>
          1. The student is strongly advised to clear the first semester fee and
          one-year residential fee before joining the Marwadi University.
        </Text>
        <Text style={styles.text}>
          2. Document checklist (while reporting at the Marwadi University):
        </Text>
        <Text style={styles.text}>
          a. Original Eligibility Certificates, Mark sheets, Transcripts and
          other related documents for admission verification
        </Text>
        <Text style={styles.text}>
          b. Passport with India Student Visa endorsed in the name of Marwadi
          University (National Identification Proof in case resident of Bhutan
          or Nepal)
        </Text>
        <Text style={styles.text}>
          c. Original Medical Fitness Certificate and Valid Health Insurance
          policy from the home country (Mandatory)
        </Text>
        <Text style={styles.text}>d. Permanent Residential Address proof</Text>
        <Text style={styles.text}>
          3. As per government guidelines, an international student must apply
          for FRO within the first 14 days of his/her arrival in India. The
          student should ensure to submit a copy of the FRO certificate to the
          Marwadi University within the stipulated time.
        </Text>
      </View>

      {/* Medical Certification */}
      <Text style={styles.sectionUnderline}>Medical Certification:</Text>
      <View>
        <Text style={styles.text}>
          Within 10 days of joining the Marwadi University, a student will have
          to undergo a medical examination as per government of India rules,
          which stipulate that all international students entering India on a
          student visa have to be tested for HIV/Yellow fever/others. In certain
          acute cases, the Marwadi University, if it deems necessary in the
          larger interest, can cancel the admission and ask the student to leave
          the country. In such a case, fees deposited shall be forfeited.
        </Text>
      </View>
      <Text style={styles.marginBottom}></Text>
      <Text style={styles.text}>
        In case you still have any query, please feel free to contact
        International Admissions Team on E-mail:{" "}
        <Text style={styles.textBoldUnderline}>
          studyinindia@marwadiuniversity.ac.in
        </Text>
      </Text>
      <Text style={styles.marginBottom}></Text>

      {/* Refund Policy */}
      <Text style={styles.sectionUnderline}>Refund Policy:</Text>
      <View>
        <Text style={styles.text}>
          Last day of refund application is 30th November, 2024. One month
          tuition fees and one month hostel + Food fees (if applicable) will be
          deducted.
        </Text>
      </View>
      <Text style={styles.marginBottom}></Text>

      {/* Closing */}
      <Text style={styles.text}>
        We welcome you at the Marwadi University, Rajkot, Gujarat, India.
      </Text>
      <Text style={styles.marginBottom}></Text>
      <Text>Best Wishes</Text>
      <Text>International Admissions</Text>
      <Text>Marwadi University</Text>
    </Page>
  </Document>
);

export default OfferLetterDocument;
