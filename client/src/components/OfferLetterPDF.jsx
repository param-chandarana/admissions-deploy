import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "../assets/muLogoBrown.png";
import sign from "../assets/sign.png";
import stamp from "../assets/stamp.png";
import calibri from "../fonts/calibri-regular.ttf";
import calibriBold from "../fonts/calibri-bold.ttf";

Font.registerHyphenationCallback((word) => {
  // Return entire word as unique part
  return [word];
});

Font.register({
  family: "Calibri",
  fonts: [
    {
      src: calibriBold,
      fontWeight: 700,
    },
    {
      src: calibri,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    position: "relative", // Added for watermark
    paddingTop: 17.370079,
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
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  logo: {
    width: 150,
  },
  text: {
    textAlign: "justify",
    fontSize: 9,
    lineHeight: 1.2,
    wordBreak: "break-word",
    hyphens: "none",
  },
  bulletPoint: {
    textAlign: "justify",
    fontSize: 12,
    marginLeft: 20,
    display: "inline-block",
    transform: "translateY(-1px)",
  },
  bulletPointSecondPage: {
    textAlign: "justify",
    fontSize: 12,
    marginLeft: 5,
    display: "inline-block",
    transform: "translateY(-1px)",
  },
  listNumber: {
    textAlign: "justify",
    fontSize: 9,
    lineHeight: 1.2,
    marginLeft: 13,
    display: "inline-block",
  },
  listNumberSecondPage: {
    textAlign: "justify",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    lineHeight: 1.2,
    display: "inline-block",
    fontWeight: 700,
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
    borderColor: "#000",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    padding: 4,
  },
  tableColBankDetails: {
    width: "50%",
    padding: 4,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  tableColBankDetailsLastRow: {
    width: "50%",
    padding: 4,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableColSmallLastRow: {
    width: "25%",
    borderColor: "#000",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    padding: 4,
  },
  tableCell: {
    textAlign: "left",
    fontSize: 9,
  },
  tableCellBankDetails: {
    textAlign: "left",
    fontSize: 10,
    fontFamily: "Calibri",
    fontWeight: 700,
  },
  tableCol: {
    width: "50%",
  },
  firstTableColLeft: {
    width: "64%",
  },
  firstTableColRight: {
    width: "36%",
  },
  tableColListIcon: {
    width: "7%",
    textAlign: "right",
  },
  tableColListIconSecondPage: {
    width: "3%",
    textAlign: "right",
  },
  tableColLeftPadding: {
    width: "10%",
    textAlign: "right",
  },
  tableColListContent: {
    paddingLeft: 1,
    width: "93%",
  },
  tableColListContentSecondPage: {
    paddingLeft: 1,
    width: "97%",
  },
  tableColContentAfterPadding: {
    width: "90%",
    paddingLeft: 11,
  },
  firstTableCell: {
    fontFamily: "Calibri",
    textAlign: "left",
    fontSize: 11,
  },
  signStampContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "65%",
  },
  sign: {
    width: 70,
  },
  stamp: {
    width: 74,
  },
  footer: {
    position: "absolute",
    bottom: 38.83465,
    right: 40.53543,
    fontFamily: "Times-Roman",
    fontSize: 12,
  },
  textBold: {
    fontWeight: 700,
    textAlign: "justify",
    fontFamily: "Helvetica-Bold",
    wordBreak: "normal",
    hyphens: "none",
    lineHeight: 1.2,
  },
  textBoldFirstLine: {
    fontWeight: 700,
    textAlign: "justify",
    fontFamily: "Calibri",
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
  waterMark: {
    position: "absolute",
    fontSize: 54,
    fontFamily: "Times-Roman",
    bottom: "41%",
    left: "-1%",
    opacity: 0.11,
    transform: "translate(1%, -41%) rotate(-50deg) scale(1.15)",
    whiteSpace: "nowrap",
  },
  superscript: {
    fontSize: 7,
    lineHeight: 1,
    verticalAlign: "super",
  },
  dateText: {
    fontSize: 11,
    fontFamily: "Calibri",
  },
});

const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const suffix = getOrdinalSuffix(day);

  return { day, suffix, month, year };
};

const OfferLetterDocument = ({ studentData }) => {
  const { day, suffix, month, year } = formatDate();
  return (
    <Document>
      {/* Page 1 */}
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <View style={styles.waterMark}>
          <Text>Not Valid for VISA Purpose</Text>
        </View>
        {/* MU Logo */}
        <View style={styles.logoContainer}>
          <Image src={logo} style={styles.logo} />
        </View>
        <Text style={styles.marginBottom}></Text>
        {/* Header */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.firstTableColLeft}>
              <Text style={styles.firstTableCell}>
                <Text style={styles.textBoldFirstLine}>
                  Ref: {studentData.studentId}
                </Text>
              </Text>
            </View>
            <View style={styles.firstTableColRight}>
              <Text style={styles.firstTableCell}>
                <Text style={styles.textBoldFirstLine}>Date: </Text>
                <Text style={styles.dateText}>
                  {day}
                  <Text style={styles.superscript}>{suffix}</Text> {month},{" "}
                  {year}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.marginBottom}></Text>

        {/* Title */}
        <View style={styles.title}>
          <Text>
            Subject: Provisional Offer Letter to study{" "}
            {studentData.qualification} – {studentData.courseOfStudy}
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
          <Text style={styles.textBold}>Offer Letter</Text> for full-time study
          of{" "}
          <Text style={styles.textBold}>
            {studentData.qualification} – {studentData.courseOfStudy}
          </Text>{" "}
          in{" "}
          <Text style={styles.textBold}>
            Marwadi University for AY 2024-25.
          </Text>
        </Text>

        <Text style={styles.section}>Details of Offered Program:</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <View style={styles.tableRow}>
                <View style={styles.tableColLeftPadding}>
                  <Text style={styles.text}>{"      "}</Text>
                </View>
                <View style={styles.tableColContentAfterPadding}>
                  <Text style={styles.tableCell}>Program Name</Text>
                </View>
              </View>
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
              <View style={styles.tableRow}>
                <View style={styles.tableColLeftPadding}>
                  <Text style={styles.text}>{"      "}</Text>
                </View>
                <View style={styles.tableColContentAfterPadding}>
                  <Text style={styles.tableCell}>Duration of Course</Text>
                </View>
              </View>
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
              <View style={styles.tableRow}>
                <View style={styles.tableColLeftPadding}>
                  <Text style={styles.text}>{"      "}</Text>
                </View>
                <View style={styles.tableColContentAfterPadding}>
                  <Text style={styles.tableCell}>Start Date</Text>
                </View>
              </View>
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
              <View style={styles.tableRow}>
                <View style={styles.tableColLeftPadding}>
                  <Text style={styles.text}>{"      "}</Text>
                </View>
                <View style={styles.tableColContentAfterPadding}>
                  <Text style={styles.tableCell}>Total Annual Tuition Fee</Text>
                </View>
              </View>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                :{"   "}USD {studentData.totalAnnualTuitionFee}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <View style={styles.tableRow}>
                <View style={styles.tableColLeftPadding}>
                  <Text style={styles.text}>{"      "}</Text>
                </View>
                <View style={styles.tableColContentAfterPadding}>
                  <Text style={styles.tableCell}>Annual Food & Hostel Fee</Text>
                </View>
              </View>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                :{"   "}USD {studentData.hostelMessAndOtherFees}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <View style={styles.tableRow}>
                <View style={styles.tableColLeftPadding}>
                  <Text style={styles.text}>{"      "}</Text>
                </View>
                <View style={styles.tableColContentAfterPadding}>
                  <Text style={styles.tableCell}>Total Annual Fee</Text>
                </View>
              </View>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                :{"   "}USD {studentData.totalAnnualFees}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <View style={styles.tableRow}>
                <View style={styles.tableColLeftPadding}>
                  <Text style={styles.text}>{"      "}</Text>
                </View>
                <View style={styles.tableColContentAfterPadding}>
                  <Text style={styles.tableCell}>
                    Special Scholarship from Institute
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                :{"   "}USD {studentData.specialScholarshipFromInstitute}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <View style={styles.tableRow}>
                <View style={styles.tableColLeftPadding}>
                  <Text style={styles.text}>{"      "}</Text>
                </View>
                <View style={styles.tableColContentAfterPadding}>
                  <Text style={styles.tableCell}>
                    Marwadi University President’s Special Scholarship
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                :{"   "}USD {studentData.MUPresidentsSpecialScholarship}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <View style={styles.tableRow}>
                <View style={styles.tableColLeftPadding}>
                  <Text style={styles.text}>{"      "}</Text>
                </View>
                <View style={styles.tableColContentAfterPadding}>
                  <Text style={styles.tableCell}>
                    <Text style={styles.textBold}>
                      Net Annual Fee Payable per Year
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                <Text style={styles.textBold}>
                  :{"   "}USD {studentData.netAnnualFeePayable}
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
              <Text style={styles.bulletPoint}>•</Text>
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
              <Text style={styles.bulletPoint}>•</Text>
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
              <Text style={styles.bulletPoint}>•</Text>
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
              <Text style={styles.bulletPoint}>•</Text>
            </View>
            <View style={styles.tableColListContent}>
              <Text style={styles.text}>
                Fill and submit the duly signed ‘Acceptance of Offer Letter’
                along with scan copy of payment transfer proof from your bank,
                to the Marwadi University at{" "}
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
          conditions (if any) have been met and will issue you the ‘
          <Text style={styles.textBold}>Acceptance Letter</Text>’. The
          Acceptance Letter can be used to apply for a Student Visa in the
          nearest Indian Embassy/Consulate in your home country.{" "}
          <Text style={styles.textBold}>
            Please ensure to apply for the visa in advance as visa process may
            take 3 - 6 weeks.
          </Text>
        </Text>

        <Text style={styles.section}>Important Information:</Text>
        <Text style={styles.marginBottom}></Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColListIcon}>
              <Text style={styles.listNumber}>1.)</Text>
            </View>
            <View style={styles.tableColListContent}>
              <Text style={styles.text}>
                The student should fill and submit the ‘Acceptance of Offer
                Letter’ at the earliest within{" "}
                <Text style={styles.textBold}>10 days</Text> of issuing this
                Offer of Admission. Any extension or delay in payment of advance
                fee shall be informed to International Department of the Marwadi
                University through e mail at:{" "}
                <Text style={styles.textBoldUnderline}>
                  studyinindia@marwadiuniversity.ac.in
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColListIcon}>
              <Text style={styles.listNumber}>2.)</Text>
            </View>
            <View style={styles.tableColListContent}>
              <Text style={styles.text}>
                At the time of reporting (joining) at the Marwadi University, it
                is mandatory for international students to get their
                eligibility/qualifying certificates verified with their
                originals.
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColListIcon}>
              <Text style={styles.listNumber}>3.)</Text>
            </View>
            <View style={styles.tableColListContent}>
              <Text style={styles.text}>
                Applicants who are either waiting for the result or appearing
                for the qualifying exam must furnish the result of their
                qualifying exam. to the Marwadi University before the last date
                as specified by the Marwadi University.
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColListIcon}>
              <Text style={styles.listNumber}>4.)</Text>
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
              <Text style={styles.listNumber}>5.)</Text>
            </View>
            <View style={styles.tableColListContent}>
              <Text style={styles.text}>
                Submission of application form or any other document or
                generation of Offer Letter and Registration Number etc. does not
                guarantee admission to any Program.
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text>Page 1 of 2</Text>
        </View>
      </Page>

      {/* Page 2 */}
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <View style={styles.waterMark}>
          <Text>Not Valid for VISA Purpose</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image src={logo} style={styles.logo} />
        </View>
        <Text style={styles.marginBottom}></Text>
        {/* Bank Details */}
        <Text style={styles.sectionUnderline}>Bank Details:</Text>
        <Text style={styles.marginBottom}></Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColSmall}>
              <Text style={styles.tableCellBankDetails}>
                Beneficiary Details
              </Text>
            </View>
            <View style={styles.tableColSmall}>
              <Text style={styles.tableCellBankDetails}>Bank Name</Text>
            </View>
            <View style={styles.tableColBankDetails}>
              <Text style={styles.tableCellBankDetails}>BANK OF INDIA</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColSmall}>
              <Text style={styles.tableCellBankDetails}></Text>
            </View>
            <View style={styles.tableColSmall}>
              <Text style={styles.tableCellBankDetails}>Account Name:</Text>
            </View>
            <View style={styles.tableColBankDetails}>
              <Text style={styles.tableCellBankDetails}>
                MEFGI - FACULTY OF ENGINEERING
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColSmall}>
              <Text style={styles.tableCellBankDetails}></Text>
            </View>
            <View style={styles.tableColSmall}>
              <Text style={styles.tableCellBankDetails}>Account Number:</Text>
            </View>
            <View style={styles.tableColBankDetails}>
              <Text style={styles.tableCellBankDetails}>313220110000012</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColSmall}>
              <Text style={styles.tableCellBankDetails}></Text>
            </View>
            <View style={styles.tableColSmall}>
              <Text style={styles.tableCellBankDetails}>Branch:</Text>
            </View>
            <View style={styles.tableColBankDetails}>
              <Text style={styles.tableCellBankDetails}>
                MARWADI EDUCATION CAMPUS BRANCH, RAJKOT
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColSmall}>
              <Text style={styles.tableCellBankDetails}></Text>
            </View>
            <View style={styles.tableColSmall}>
              <Text style={styles.tableCellBankDetails}>SWIFT Code</Text>
            </View>
            <View style={styles.tableColBankDetails}>
              <Text style={styles.tableCellBankDetails}>BKIDINBBRAJ</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColSmallLastRow}>
              <Text style={styles.tableCellBankDetails}></Text>
            </View>
            <View style={styles.tableColSmallLastRow}>
              <Text style={styles.tableCellBankDetails}>IFSC Code:</Text>
            </View>
            <View style={styles.tableColBankDetailsLastRow}>
              <Text style={styles.tableCellBankDetails}>BKID0003132</Text>
            </View>
          </View>
        </View>

        {/* Instructions for International Applicant */}
        <Text style={styles.sectionUnderline}>
          Instructions for International Applicant:
        </Text>
        <Text style={styles.marginBottom}></Text>
        <View>
          <View style={styles.tableRow}>
            <View style={styles.tableColListIconSecondPage}>
              <Text style={styles.bulletPointSecondPage}>•</Text>
            </View>
            <View style={styles.tableColListContentSecondPage}>
              <Text style={styles.text}>
                All International students has to pay their course fee
                semester-wise.
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColListIconSecondPage}>
              <Text style={styles.bulletPointSecondPage}>•</Text>
            </View>
            <View style={styles.tableColListContentSecondPage}>
              <Text style={styles.text}>
                Bank charges, in case online transfer of fee, will be borne by
                the applicant. The Marwadi University will credit the same
                amount which will be received in its account. The student will
                have to deposit the balance in case of any difference in the
                amount received by the Marwadi University in its bank account.
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColListIconSecondPage}>
              <Text style={styles.bulletPointSecondPage}>•</Text>
            </View>
            <View style={styles.tableColListContentSecondPage}>
              <Text style={styles.text}>
                Student should confirm the successful transfer of his/her fee by
                sending the scan copy of transaction proof through e mail at:{" "}
                <Text style={styles.textBold}>
                  studyinindia@marwadiuniversity.ac.in
                </Text>{" "}
                and shall retain original proof of the fee transferred and
                produce it while reporting at the Marwadi University
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionUnderline}>
          Instructions while Reporting/Joining at the Marwadi University:
        </Text>
        <View>
          <View style={styles.tableRow}>
            <View style={styles.tableColListIconSecondPage}>
              <Text style={styles.listNumberSecondPage}>1.</Text>
            </View>
            <View style={styles.tableColListContentSecondPage}>
              <Text style={styles.text}>
                The student is strongly advised to clear the first semester fee
                and one-year residential fee before joining the Marwadi
                University.
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColListIconSecondPage}>
              <Text style={styles.listNumberSecondPage}>2.</Text>
            </View>
            <View style={styles.tableColListContentSecondPage}>
              <Text style={styles.text}>
                Document checklist (while reporting at the Marwadi University):
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColListIconSecondPage}>
              <Text style={styles.listNumberSecondPage}>a.</Text>
            </View>
            <View style={styles.tableColListContentSecondPage}>
              <Text style={styles.text}>
                Original Eligibility Certificates, Mark sheets, Transcripts and
                other related documents for admission verification
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColListIconSecondPage}>
              <Text style={styles.listNumberSecondPage}>b.</Text>
            </View>
            <View style={styles.tableColListContentSecondPage}>
              <Text style={styles.text}>
                Passport with India Student Visa endorsed in the name of Marwadi
                University (National Identification Proof in case resident of
                Bhutan or Nepal)
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColListIconSecondPage}>
              <Text style={styles.listNumberSecondPage}>c.</Text>
            </View>
            <View style={styles.tableColListContentSecondPage}>
              <Text style={styles.text}>
                Original Medical Fitness Certificate and Valid Health Insurance
                policy from the home country (Mandatory)
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColListIconSecondPage}>
              <Text style={styles.listNumberSecondPage}>d.</Text>
            </View>
            <View style={styles.tableColListContentSecondPage}>
              <Text style={styles.text}>
                Permanent Residential Address proof
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColListIconSecondPage}>
              <Text style={styles.listNumberSecondPage}>3.</Text>
            </View>
            <View style={styles.tableColListContentSecondPage}>
              <Text style={styles.text}>
                As per government guidelines, an international student must
                apply for FRO within the first 14 days of his/her arrival in
                India. The student should ensure to submit a copy of the FRO
                certificate to the Marwadi University within the stipulated
                time.
              </Text>
            </View>
          </View>
        </View>

        {/* Medical Certification */}
        <Text style={styles.sectionUnderline}>Medical Certification:</Text>
        <View>
          <Text style={styles.text}>
            Within 10 days of joining the Marwadi University, a student will
            have to undergo a medical examination as per government of India
            rules, which stipulate that all international students entering
            India on a student visa have to be tested for HIV/Yellow
            fever/others. In certain acute cases, the Marwadi University, if it
            deems necessary in the larger interest, can cancel the admission and
            ask the student to leave the country. In such a case, fees deposited
            shall be forfeited.
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
            tuition fees and one month hostel + Food fees (if applicable) will
            be deducted.
          </Text>
        </View>
        <Text style={styles.marginBottom}></Text>

        {/* Closing */}
        <Text style={styles.text}>
          We welcome you at the Marwadi University, Rajkot, Gujarat, India.
        </Text>
        <Text style={styles.marginBottom}></Text>
        <Text>Best Wishes</Text>
        <Text style={styles.marginBottom}></Text>
        <View style={styles.signStampContainer}>
          <View>
            <Image src={sign} style={styles.sign} />
            <Text style={styles.marginBottom}></Text>
            <Text style={styles.textBold}>International Admissions,</Text>
            <Text style={styles.textBold}>Marwadi University</Text>
          </View>
          <Image src={stamp} style={styles.stamp} />
        </View>
        <View style={styles.footer}>
          <Text>Page 2 of 2</Text>
        </View>
      </Page>
    </Document>
  );
};

export default OfferLetterDocument;
