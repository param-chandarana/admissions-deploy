import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CourseForm = ({ isEditMode }) => {
  const [courseData, setCourseData] = useState({
    courseName: "",
    qualification: "",
    duration: 0,
    totalAnnualTuitionFee: 0,
    hostelMessAndOtherFees: 0,
    totalAnnualFees: 0,
    specialScholarshipFromInstitute: 0,
    MUPresidentsSpecialScholarship: 0,
    netAnnualFeePayable: 0,
  });
  const [existingCourses, setExistingCourses] = useState([]);
  const [initialCourseData, setInitialCourseData] = useState(null);
  const { courseId } = useParams();
  const initialFetchRef = useRef(true);

  useEffect(() => {
    if (isEditMode && initialFetchRef.current) {
      initialFetchRef.current = false;
      async function fetchCourse() {
        try {
          const response = await axios.get(`/api/courses/get/${courseId}`);
          setCourseData(response.data);
          setInitialCourseData(response.data);
        } catch (error) {
          toast.error("Error fetching course");
        }
      }
      fetchCourse();
    } else {
      setCourseData({
        courseName: "",
        qualification: "",
        duration: 0,
        totalAnnualTuitionFee: 0,
        hostelMessAndOtherFees: 0,
        totalAnnualFees: 0,
        specialScholarshipFromInstitute: 0,
        MUPresidentsSpecialScholarship: 0,
        netAnnualFeePayable: 0,
      });
    }
  }, [courseId, isEditMode]);

  useEffect(() => {
    async function fetchExistingCourses() {
      try {
        const response = await axios.get("/api/courses/get-all");
        setExistingCourses(response.data);
      } catch (error) {
        toast.error("Error fetching existing courses");
      }
    }

    fetchExistingCourses();
  }, []);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const trimValues = (data) => {
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === 'string' ? data[key].trim() : data[key];
      return acc;
    }, {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedCourseData = trimValues(courseData);

    const totalAnnualFees = parseFloat(trimmedCourseData.totalAnnualFees);
    const specialScholarshipFromInstitute = parseFloat(trimmedCourseData.specialScholarshipFromInstitute);
    const MUPresidentsSpecialScholarship = parseFloat(trimmedCourseData.MUPresidentsSpecialScholarship);
    const totalScholarships = specialScholarshipFromInstitute + MUPresidentsSpecialScholarship;

    if (totalScholarships > totalAnnualFees) {
      toast.error("Total scholarships cannot be greater than total fees");
      return;
    }

    if (isEditMode) {
      if (JSON.stringify(trimmedCourseData) === JSON.stringify(initialCourseData)) {
        toast.info("Nothing to update");
        return;
      }
      try {
        await axios.put(`/api/courses/update/${courseId}`, trimmedCourseData);
        setInitialCourseData(trimmedCourseData);
        toast.success("Course updated successfully");
        // Update the existingCourses state
        setExistingCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === courseId ? trimmedCourseData : course
          )
        );
      } catch (error) {
        toast.error("Error updating course");
      }
    } else {
      // Check for duplicates
      const isDuplicate = existingCourses.some(
        (course) =>
          course.courseName.toLowerCase() === trimmedCourseData.courseName.toLowerCase() &&
          course.qualification.toLowerCase() === trimmedCourseData.qualification.toLowerCase()
      );

      if (isDuplicate) {
        toast.error("Course with the same name and qualification already exists");
        return;
      }
      try {
        await axios.post(`/api/courses/add`, trimmedCourseData);
        toast.success("Course added successfully");
        // Append the new course to existingCourses state
        setExistingCourses((prevCourses) => [...prevCourses, trimmedCourseData]);
        setCourseData({
          courseName: "",
          qualification: "",
          duration: 0,
          totalAnnualTuitionFee: 0,
          hostelMessAndOtherFees: 0,
          totalAnnualFees: 0,
          specialScholarshipFromInstitute: 0,
          MUPresidentsSpecialScholarship: 0,
          netAnnualFeePayable: 0,
        });
      } catch (error) {
        toast.error("Error adding course");
      }
    }
  };

  const calculateTotalAnnualFees = () => {
    const totalAnnualTuitionFee = parseInt(courseData.totalAnnualTuitionFee, 10) || 0;
    const hostelMessAndOtherFees = parseInt(courseData.hostelMessAndOtherFees, 10) || 0;
    const totalAnnualFees = totalAnnualTuitionFee + hostelMessAndOtherFees;
    setCourseData((prevData) => ({ ...prevData, totalAnnualFees }));
  };

  const calculateNetAnnualFeePayable = () => {
    const totalAnnualFees = parseInt(courseData.totalAnnualFees, 10) || 0;
    const specialScholarshipFromInstitute = parseInt(courseData.specialScholarshipFromInstitute, 10) || 0;
    const MUPresidentsSpecialScholarship = parseInt(courseData.MUPresidentsSpecialScholarship, 10) || 0;
    const netAnnualFeePayable = totalAnnualFees - specialScholarshipFromInstitute - MUPresidentsSpecialScholarship;
    setCourseData((prevData) => ({ ...prevData, netAnnualFeePayable }));
  };

  useEffect(() => {
    calculateTotalAnnualFees();
  }, [courseData.totalAnnualTuitionFee, courseData.hostelMessAndOtherFees]);

  useEffect(() => {
    calculateNetAnnualFeePayable();
  }, [
    courseData.totalAnnualFees,
    courseData.specialScholarshipFromInstitute,
    courseData.MUPresidentsSpecialScholarship,
  ]);

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h1 className="h2 mb-4">{isEditMode ? "Edit" : "Add"} Course</h1>
      <form onSubmit={handleSubmit}>
        <div className="card p-4 mb-md-4 mb-3">
          <h2 className="h5 mb-3">Course Information</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="courseName" className="form-label mb-1">
                Course Name
              </label>
              <input
                type="text"
                name="courseName"
                id="courseName"
                value={courseData.courseName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="qualification" className="form-label mb-1">
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                id="qualification"
                value={courseData.qualification}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="duration" className="form-label mb-1">
                Duration (in Years)
              </label>
              <input
                type="number"
                name="duration"
                id="duration"
                value={courseData.duration}
                onChange={handleChange}
                className="form-control"
                required
                min="0.1"
                step="any"
              />
            </div>
          </div>
        </div>
        <div className="card p-4 mb-md-4 mb-3">
          <h2 className="h5 mb-3">Fee Information</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="totalAnnualTuitionFee" className="form-label mb-1">
                Total Annual Tuition Fee
              </label>
              <input
                type="number"
                name="totalAnnualTuitionFee"
                id="totalAnnualTuitionFee"
                value={courseData.totalAnnualTuitionFee}
                onChange={handleChange}
                className="form-control"
                required
                min="1"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="hostelMessAndOtherFees" className="form-label mb-1">
                Hostel, Mess, and Other Fees
              </label>
              <input
                type="number"
                name="hostelMessAndOtherFees"
                id="hostelMessAndOtherFees"
                value={courseData.hostelMessAndOtherFees}
                onChange={handleChange}
                className="form-control"
                required
                min="1"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="totalAnnualFees" className="form-label mb-1">
                Total Annual Fees
              </label>
              <input
                type="number"
                name="totalAnnualFees"
                id="totalAnnualFees"
                value={courseData.totalAnnualFees}
                onChange={handleChange}
                className="form-control"
                readOnly
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="specialScholarshipFromInstitute" className="form-label mb-1">
                Special Scholarship From Institute
              </label>
              <input
                type="number"
                name="specialScholarshipFromInstitute"
                id="specialScholarshipFromInstitute"
                value={courseData.specialScholarshipFromInstitute}
                onChange={handleChange}
                className="form-control"
                required
                min="0"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="MUPresidentsSpecialScholarship" className="form-label mb-1">
                MU President's Special Scholarship
              </label>
              <input
                type="number"
                name="MUPresidentsSpecialScholarship"
                id="MUPresidentsSpecialScholarship"
                value={courseData.MUPresidentsSpecialScholarship}
                onChange={handleChange}
                className="form-control"
                required
                min="0"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="netAnnualFeePayable" className="form-label mb-1">
                Net Annual Fee Payable
              </label>
              <input
                type="number"
                name="netAnnualFeePayable"
                id="netAnnualFeePayable"
                value={courseData.netAnnualFeePayable}
                onChange={handleChange}
                className="form-control"
                readOnly
                required
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn mb-3">
          {isEditMode ? "Edit" : "Add"} Course
        </button>
      </form>
    </div>
  );
};

export default CourseForm;
