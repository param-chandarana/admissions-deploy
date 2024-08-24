import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const StudentForm = ({ isEditMode }) => {
  const [studentData, setStudentData] = useState({
    studentId: "",
    studentName: "",
    countryName: "",
    qualification: "",
    courseOfStudy: "",
    duration: 0,
    totalAnnualTuitionFee: 0,
    hostelMessAndOtherFees: 0,
    totalAnnualFees: 0,
    specialScholarshipFromInstitute: 0,
    MUPresidentsSpecialScholarship: 0,
    netAnnualFeePayable: 0,
  });

  const [courses, setCourses] = useState([]);
  const [uniqueQualifications, setUniqueQualifications] = useState([]);
  const [correspondingCourses, setCorrespondingCourses] = useState([]);
  const [countryNames, setCountryNames] = useState([]);
  const [newId, setnewId] = useState("");
  const [initialStudentData, setInitialStudentData] = useState(null);
  const { studentId } = useParams();

  const initialFetchRef = useRef({
    countries: true,
    courses: true,
    student: true,
  });

  useEffect(() => {
    if (initialFetchRef.current.countries) {
      initialFetchRef.current.countries = false;
      const fetchCountries = async () => {
        try {
          const response = await axios.get(
            "https://restcountries.com/v3.1/all"
          );
          const names = response.data.map((country) => country.name.common);
          names.sort((a, b) => a.localeCompare(b));
          setCountryNames(names);
        } catch (error) {
          // console.error("Error fetching countries:", error);
          toast.error("Error fetching countries");
        }
      };

      fetchCountries();
    }
  }, []);

  useEffect(() => {
    if (initialFetchRef.current.courses) {
      initialFetchRef.current.courses = false;
      const fetchCourses = async () => {
        try {
          const response = await axios.get(`/api/courses/get-all`);
          setCourses(response.data);
        } catch (error) {
          // console.error("Error fetching courses:", error);
          toast.error("Error fetching courses");
        }
      };

      fetchCourses();
    }
  }, []);

  useEffect(() => {
    if (isEditMode) {
      if (initialFetchRef.current.student) {
        initialFetchRef.current.student = false;
        const fetchStudent = async () => {
          try {
            const response = await axios.get(`/api/students/get/${studentId}`);
            setStudentData(response.data);
            setInitialStudentData(response.data);
            setUniqueQualifications([
              ...new Set(courses.map((course) => course.qualification)),
            ]);
            setCorrespondingCourses(
              courses.filter((course) => course.qualification === studentData.qualification)
            );
          } catch (error) {
            toast.error("Error fetching student");
          }
        };

        fetchStudent();
      }
    } else {
      handleAddAnotherStudent();
    }
  }, [studentId, isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      generateStudentId();
    }
  }, [isEditMode]);

  useEffect(() => {
    getUniqueQualifications();
  }, [courses]);

  useEffect(() => {
    if (studentData.qualification !== "") {
      setCorrespondingCourses(
        courses.filter((course) => course.qualification === studentData.qualification)
      );
    }
  }, [studentData.qualification, courses]);

  useEffect(() => {
    if (
      studentData.courseOfStudy !== "" &&
      studentData.courseOfStudy !== "Select a course" &&
      studentData.qualification !== "" &&
      studentData.qualification !== "Select a qualification"
    ) {
      const selectedCourse = courses.find(
        (course) =>
          course.courseName === studentData.courseOfStudy &&
          course.qualification === studentData.qualification
      );
      if (selectedCourse) {
        setStudentData((prev) => ({
          ...prev,
          duration: selectedCourse.duration,
          totalAnnualTuitionFee: selectedCourse.totalAnnualTuitionFee,
          hostelMessAndOtherFees: selectedCourse.hostelMessAndOtherFees,
          totalAnnualFees: selectedCourse.totalAnnualFees,
          specialScholarshipFromInstitute:
            selectedCourse.specialScholarshipFromInstitute,
          MUPresidentsSpecialScholarship:
            selectedCourse.MUPresidentsSpecialScholarship,
          netAnnualFeePayable: selectedCourse.netAnnualFeePayable,
        }));
      }
    } else {
      setStudentData((prev) => ({
        ...prev,
        duration: 0,
        totalAnnualTuitionFee: 0,
        hostelMessAndOtherFees: 0,
        totalAnnualFees: 0,
        specialScholarshipFromInstitute: 0,
        MUPresidentsSpecialScholarship: 0,
        netAnnualFeePayable: 0,
      }));
    }
  }, [studentData.courseOfStudy, studentData.qualification, courses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateStudentId = async () => {
    try {
      const response = await axios.get(`/api/last-id/get`);
      const { lastStudentId } = response.data;

      const currentYear = new Date().getFullYear();
      const nextYearShort = (currentYear + 1) % 100;
      const currentAcademicYear = `${currentYear}-${nextYearShort
        .toString()
        .padStart(2, "0")}`;

      let newStudentId;
      if (lastStudentId) {
        const lastAcademicYear = lastStudentId.split("/")[2]; // Assuming the academic year is the third part of the ID
        const serialNumber = parseInt(lastStudentId.split("/").pop());

        if (lastAcademicYear !== currentAcademicYear) {
          // If the academic year has changed, start the serial number from 001
          newStudentId = `INT/INT-KV/${currentAcademicYear}/001`;
        } else {
          // If the academic year is the same, increment the last serial number
          const nextSerialNumberFormatted = (serialNumber + 1)
            .toString()
            .padStart(3, "0");
          newStudentId = `INT/INT-KV/${currentAcademicYear}/${nextSerialNumberFormatted}`;
        }
      } else {
        // If there's no last student ID, start from 001
        newStudentId = `INT/INT-KV/${currentAcademicYear}/001`;
      }

      setnewId(newStudentId);
      setStudentData((prev) => ({
        ...prev,
        studentId: newStudentId,
      }));
    } catch (error) {
      // console.error("Error generating student ID:", error.message);
      toast.error("Error generating student ID");
    }
  };

  const getUniqueQualifications = () => {
    setUniqueQualifications([
      ...new Set(courses.map((course) => course.qualification)),
    ]);
  };

  const handleGenerateOfferLetter = async () => {
    const trimmedStudentData = trimValues(studentData)
    try {
      // Extract last three characters of studentId
      const studentId = studentData.studentId;
      const fileName = studentId
        .substring(studentId.length - 3)
        .replace(/^0+/, ""); // Remove leading zeroes

      // Send request to server to generate offer letter
      const response = await axios.post(`/api/pdf/generate`, trimmedStudentData, {
        responseType: "blob", // Receive response as a Blob
      });

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
    } catch (error) {
      // console.error("Error generating offer letter:", error);
    }
  };

  const trimValues = (data) => {
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === 'string' ? data[key].trim() : data[key];
      return acc;
    }, {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedStudentData = trimValues(studentData);
    if (isEditMode) {
      if (JSON.stringify(trimmedStudentData) === JSON.stringify(initialStudentData)) {
        toast.info("Nothing to update");
        return;
      }
      try {
        await axios.put(`/api/students/update/${studentId}`, trimmedStudentData);
        setInitialStudentData(trimmedStudentData);
        handleGenerateOfferLetter();
        toast.success("Student updated and offer letter generated successfully");
      } catch (error) {
        toast.error("Error updating student");
      }
    } else {
      try {
        await axios.post(`/api/students/add`, trimmedStudentData);

        await axios.put(`/api/last-id/update`, {
          lastStudentId: newId,
        });

        handleGenerateOfferLetter();
        toast.success("Student added and offer letter generated successfully");
        handleAddAnotherStudent();
      } catch (error) {
        console.error("Error adding student:", error);
        toast.error("Error adding student");
      }
    }
  };

  const handleAddAnotherStudent = () => {
    setStudentData({
      studentId: "",
      studentName: "",
      countryName: "",
      qualification: "",
      courseOfStudy: "",
      duration: "",
      totalAnnualTuitionFee: 0,
      hostelMessAndOtherFees: 0,
      totalAnnualFees: 0,
      specialScholarshipFromInstitute: 0,
      MUPresidentsSpecialScholarship: 0,
      netAnnualFeePayable: 0,
    });
    generateStudentId();
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h1 className="h2 mb-4">{isEditMode ? "Edit" : "Add"} Student</h1>
      <form onSubmit={handleSubmit}>
        <div className="card p-4 mb-md-4 mb-3">
          <h2 className="h5 mb-3">Personal Information</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="studentId" className="d-block mb-1">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={studentData.studentId}
                className="form-control d-block"
                onChange={handleInputChange}
                readOnly
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="studentName" className="d-block mb-1">
                Student Name
              </label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={studentData.studentName}
                onChange={handleInputChange}
                className="form-control d-block"
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="countryName" className="d-block mb-1">
                Country
              </label>
              <select
                id="countryName"
                name="countryName"
                value={studentData.countryName}
                onChange={handleInputChange}
                className="form-select d-block"
                required
              >
                <option value="">Select a country</option>
                {countryNames.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="card p-4 mb-md-4 mb-3">
          <h2 className="h5 mb-3">Academic Information</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="qualification" className="d-block mb-1">
                Qualification
              </label>
              <select
                id="qualification"
                name="qualification"
                value={studentData.qualification}
                onChange={handleInputChange}
                className="form-select d-block"
                required
              >
                <option value="">Select a qualification</option>
                {uniqueQualifications.sort().map((qualification) => (
                  <option key={qualification} value={qualification}>
                    {qualification}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="courseOfStudy" className="d-block mb-1">
                Course of Study
              </label>
              <select
                id="courseOfStudy"
                name="courseOfStudy"
                value={studentData.courseOfStudy}
                onChange={handleInputChange}
                className="form-select d-block"
                required
              >
                <option value="">Select a course</option>
                {correspondingCourses.sort((a, b) => a.courseName.localeCompare(b.courseName)).map((course) => (
                  <option key={course.courseName} value={course.courseName}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="duration" className="d-block mb-1">
                Duration (in Years)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={studentData.duration}
                className="form-control d-block"
                readOnly
                required
              />
            </div>
          </div>
        </div>
        <div className="card p-4 mb-md-4 mb-3">
          <h2 className="h5 mb-3">Fee Information</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="totalAnnualTuitionFee" className="d-block mb-1">
                Total Annual Tuition Fee
              </label>
              <input
                type="number"
                id="totalAnnualTuitionFee"
                name="totalAnnualTuitionFee"
                value={studentData.totalAnnualTuitionFee}
                className="form-control d-block"
                readOnly
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="hostelMessAndOtherFees" className="d-block mb-1">
                Hostel, Mess, and Other Fees
              </label>
              <input
                type="number"
                id="hostelMessAndOtherFees"
                name="hostelMessAndOtherFees"
                value={studentData.hostelMessAndOtherFees}
                className="form-control d-block"
                readOnly
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="totalAnnualFees" className="d-block mb-1">
                Total Annual Fees
              </label>
              <input
                type="number"
                id="totalAnnualFees"
                name="totalAnnualFees"
                value={studentData.totalAnnualFees}
                className="form-control d-block"
                readOnly
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label
                htmlFor="specialScholarshipFromInstitute"
                className="d-block mb-1"
              >
                Special Scholarship from Institute
              </label>
              <input
                type="number"
                id="specialScholarshipFromInstitute"
                name="specialScholarshipFromInstitute"
                value={studentData.specialScholarshipFromInstitute}
                className="form-control d-block"
                readOnly
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label
                htmlFor="MUPresidentsSpecialScholarship"
                className="d-block mb-1"
              >
                MU President's Special Scholarship
              </label>
              <input
                type="number"
                id="MUPresidentsSpecialScholarship"
                name="MUPresidentsSpecialScholarship"
                value={studentData.MUPresidentsSpecialScholarship}
                className="form-control d-block"
                readOnly
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="netAnnualFeePayable" className="d-block mb-1">
                Net Annual Fee Payable
              </label>
              <input
                type="number"
                id="netAnnualFeePayable"
                name="netAnnualFeePayable"
                value={studentData.netAnnualFeePayable}
                className="form-control d-block"
                readOnly
                required
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn mb-3">
          {isEditMode ? "Edit" : "Add"} Student
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
