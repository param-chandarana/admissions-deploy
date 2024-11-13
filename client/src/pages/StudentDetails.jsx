import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import OfferLetterButton from "../components/OfferLetterButton";
import Loader from "../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
  faSearch,
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

const StudentDetails = () => {
  const [filters, setFilters] = useState({
    countryName: [],
    qualification: [],
    courseOfStudy: [],
    duration: [],
  });
  const [filterData, setFilterData] = useState({});
  const [countryNames, setCountryNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showQualificationCollapse, setShowQualificationCollapse] =
    useState(false);
  const [showDurationCollapse, setShowDurationCollapse] = useState(false);
  const [showCountryCollapse, setShowCountryCollapse] = useState(false);
  const [showCourseCollapse, setShowCourseCollapse] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [sortField, setSortField] = useState("studentId"); // Default sort by studentId
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order ascending
  const [isLoading, setIsLoading] = useState(false);

  const pages = new Array(numberOfPages).fill(null).map((v, i) => i);

  const initialFetchRef = useRef({
    students: true,
    courses: true,
    countries: true,
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    if (initialFetchRef.current.students) {
      initialFetchRef.current.students = false;
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const filterParams = {
            page: pageNumber,
            countryName: filters.countryName.join(","),
            qualification: filters.qualification.join(","),
            courseOfStudy: filters.courseOfStudy.join(","),
            duration: filters.duration.join(","),
            search: searchQuery,
            sortField: sortField || "studentId",
            sortOrder: sortOrder || "asc",
          };

          const response = await axios.get(`/api/students/get`, {
            params: filterParams,
          });

          setStudentData(response.data.students);
          setTotalCount(response.data.totalStudents);
          setFilteredCount(response.data.filteredStudents);
          setNumberOfPages(response.data.totalPages);
          initialFetchRef.current.students = true;
        } catch (error) {
          toast.error("Error fetching students");
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [pageNumber, filters, searchQuery, sortField, sortOrder]);

  useEffect(() => {
    if (initialFetchRef.current.courses) {
      initialFetchRef.current.courses = false;
      const fetchFilterData = async () => {
        try {
          const response = await axios.get(`/api/courses/get-details`);
          setFilterData(response.data);
        } catch (error) {
          toast.error("Error fetching filter data");
        }
      };

      fetchFilterData();
    }
  }, []);

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
          toast.error("Error fetching countries");
        }
      };

      fetchCountries();
    }
  }, []);

  const gotoPrevious = () => {
    setPageNumber(Math.max(0, pageNumber - 1));
  };

  const gotoNext = () => {
    setPageNumber(Math.min(numberOfPages - 1, pageNumber + 1));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value],
    }));
    if (!isLoading) {
      setPageNumber(0);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      countryName: [],
      qualification: [],
      courseOfStudy: [],
      duration: [],
    });
    setSearchQuery("");
    if (!isLoading) {
      setPageNumber(0);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (!isLoading) {
      setPageNumber(0);
    }
  };

  const handleDelete = (deletedStudentId) => {
    setStudentData((prev) =>
      prev.filter((studentData) => studentData._id !== deletedStudentId)
    );
  };

  const getAcademicYear = (studentId) => {
    const match = studentId.match(/\/(\d{4}-\d{2})\//);
    return match ? match[1] : "";
  };

  const visibleCount = studentData.length;

  useEffect(() => {
    if (visibleCount === 0 && filteredCount !== 0) {
      setPageNumber(Math.max(0, pageNumber - 1));
    }
  }, [visibleCount]);

  const handleDownload = () => {
    const filterParams = {
      page: pageNumber,
      countryName: filters.countryName.join(","),
      qualification: filters.qualification.join(","),
      courseOfStudy: filters.courseOfStudy.join(","),
      duration: filters.duration.join(","),
      search: searchQuery,
      sortField: sortField || "studentId",
      sortOrder: sortOrder || "asc",
    };

    if (filteredCount === 0) {
      toast.info("No data to download");
      return;
    }

    axios({
      url: "/api/students/download-excel",
      method: "GET",
      params: filterParams,
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Students.xlsx");
        document.body.appendChild(link);
        link.click();
        toast.success("File downloaded successfully");
      })
      .catch((error) => {
        toast.error("Error downloading file");
        console.error("Error downloading file:", error);
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="container-fluid mt-4">
        <h1 className="h2 mb-4">Student Details</h1>
        <div className="mb-4 d-flex justify-content-start gap-2 align-items-center">
          <button
            className="btn"
            type="button"
            onClick={() => setShowOffcanvas(!showOffcanvas)}
          >
            Show Filters
          </button>

          <button className="btn" type="button" onClick={handleDownload}>
            Download List
          </button>
        </div>
        <div
          className={`offcanvas offcanvas-start${showOffcanvas ? " show" : ""}`}
          tabIndex="-1"
          id="offcanvasFilters"
          aria-labelledby="offcanvasFiltersLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title h4" id="offcanvasFiltersLabel">
              Filters
            </h5>
            <button
              type="button"
              className="btn-close text-reset"
              onClick={() => setShowOffcanvas(false)}
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="input-group form-control mb-3 search-container p-0 d-flex align-items-top">
              <input
                type="search"
                className="form-control search-bar"
                placeholder="Search by Student Name"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <div className="p-2">
                <FontAwesomeIcon icon={faSearch} />
              </div>
            </div>
            <div className="mb-3">
              <button
                className="btn btn-link text-decoration-none"
                type="button"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
            {/* Country Filter */}
            <div>
              <button
                className="btn-filter-category text-decoration-none d-flex justify-content-between align-items-center"
                type="button"
                onClick={() => setShowCountryCollapse(!showCountryCollapse)}
              >
                Country
                <FontAwesomeIcon
                  icon={showCountryCollapse ? faChevronRight : faChevronDown}
                  className="ms-1 small"
                />
              </button>
              <div
                className={`collapse${showCountryCollapse ? " show" : ""} mb-3`}
                id="countryCollapse"
              >
                {countryNames?.sort().map((countryName, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      id={countryName}
                      value={countryName}
                      checked={filters.countryName.includes(countryName)}
                      onChange={() =>
                        handleFilterChange("countryName", countryName)
                      }
                    />
                    <label htmlFor={countryName} className="small-font">
                      {countryName}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* Qualification Filter */}
            <div>
              <button
                className="btn-filter-category text-decoration-none d-flex justify-content-between align-items-center"
                type="button"
                onClick={() =>
                  setShowQualificationCollapse(!showQualificationCollapse)
                }
              >
                Qualification
                <FontAwesomeIcon
                  icon={
                    showQualificationCollapse ? faChevronRight : faChevronDown
                  }
                  className="ms-1 small"
                />
              </button>
              <div
                className={`collapse${
                  showQualificationCollapse ? " show" : ""
                } mb-3`}
                id="qualificationCollapse"
              >
                {filterData.qualifications
                  ?.sort()
                  .map((qualification, index) => (
                    <div key={index}>
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        id={qualification}
                        value={qualification}
                        checked={filters.qualification.includes(qualification)}
                        onChange={() =>
                          handleFilterChange("qualification", qualification)
                        }
                      />
                      <label htmlFor={qualification} className="small-font">
                        {qualification}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
            {/* Course of Study Filter */}
            <div>
              <button
                className="btn-filter-category text-decoration-none d-flex justify-content-between align-items-center"
                type="button"
                onClick={() => setShowCourseCollapse(!showCourseCollapse)}
              >
                Course of Study
                <FontAwesomeIcon
                  icon={showCourseCollapse ? faChevronRight : faChevronDown}
                  className="ms-1 small"
                />
              </button>
              <div
                className={`collapse${showCourseCollapse ? " show" : ""} mb-3`}
                id="courseCollapse"
              >
                {filterData.courseNames?.sort().map((courseOfStudy, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      id={courseOfStudy}
                      value={courseOfStudy}
                      checked={filters.courseOfStudy.includes(courseOfStudy)}
                      onChange={() =>
                        handleFilterChange("courseOfStudy", courseOfStudy)
                      }
                    />
                    <label htmlFor={courseOfStudy} className="small-font">
                      {courseOfStudy}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* Duration Filter */}
            <div>
              <button
                className="btn-filter-category text-decoration-none d-flex justify-content-between align-items-center"
                type="button"
                onClick={() => setShowDurationCollapse(!showDurationCollapse)}
              >
                Duration (in Years)
                <FontAwesomeIcon
                  icon={showDurationCollapse ? faChevronRight : faChevronDown}
                  className="ms-1 small"
                />
              </button>
              <div
                className={`collapse${
                  showDurationCollapse ? " show" : ""
                } mb-3`}
                id="durationCollapse"
              >
                {filterData.durations?.sort().map((duration, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      id={duration}
                      value={duration}
                      checked={filters.duration.includes(duration.toString())}
                      onChange={() =>
                        handleFilterChange("duration", duration.toString())
                      }
                    />
                    <label htmlFor={duration} className="small-font">
                      {duration}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <p>
              <b>Total Records:</b> {totalCount}
            </p>
            <div className="table-responsive overflow-auto">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("studentId")}>
                      Student ID
                      {sortField === "studentId" ? (
                        <FontAwesomeIcon
                          icon={sortOrder === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("studentName")}>
                      Student Name
                      {sortField === "studentName" ? (
                        <FontAwesomeIcon
                          icon={sortOrder === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("countryName")}>
                      Country
                      {sortField === "countryName" ? (
                        <FontAwesomeIcon
                          icon={sortOrder === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("qualification")}>
                      Qualification
                      {sortField === "qualification" ? (
                        <FontAwesomeIcon
                          icon={sortOrder === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("courseOfStudy")}>
                      Course Of Study
                      {sortField === "courseOfStudy" ? (
                        <FontAwesomeIcon
                          icon={sortOrder === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("duration")}>
                      Duration (in Years)
                      {sortField === "duration" ? (
                        <FontAwesomeIcon
                          icon={sortOrder === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("totalAnnualTuitionFee")}>
                      Total Annual Tuition Fee
                      {sortField === "totalAnnualTuitionFee" ? (
                        <FontAwesomeIcon
                          icon={sortOrder === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("hostelMessAndOtherFees")}>
                      Hostel, Mess and Other Fees
                      {sortField === "hostelMessAndOtherFees" ? (
                        <FontAwesomeIcon
                          icon={sortOrder === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("totalAnnualFees")}>
                      Total Annual Fees
                      {sortField === "totalAnnualFees" ? (
                        <FontAwesomeIcon
                          icon={sortOrder === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th
                      onClick={() =>
                        handleSort("specialScholarshipFromInstitute")
                      }
                    >
                      Special Scholarship
                      {sortField === "specialScholarshipFromInstitute" ? (
                        <FontAwesomeIcon
                          icon={sortOrder === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th
                      onClick={() =>
                        handleSort("MUPresidentsSpecialScholarship")
                      }
                    >
                      MU President's Scholarship
                      {sortField === "MUPresidentsSpecialScholarship" ? (
                        <FontAwesomeIcon
                          icon={sortOrder === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("netAnnualFeePayable")}>
                      Net Annual Fee Payable
                      {sortField === "netAnnualFeePayable" ? (
                        <FontAwesomeIcon
                          icon={sortOrder === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {isLoading ? (
                  <tbody>
                    <tr>
                      <td colSpan="13">
                        <Loader />
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {studentData.length > 0 ? (
                      studentData.map((student, index) => (
                        <tr key={index}>
                          <td>{student.studentId}</td>
                          <td>{student.studentName}</td>
                          <td>{student.countryName}</td>
                          <td>{student.qualification}</td>
                          <td>{student.courseOfStudy}</td>
                          <td>{student.duration}</td>
                          <td>{student.totalAnnualTuitionFee}</td>
                          <td>{student.hostelMessAndOtherFees}</td>
                          <td>{student.totalAnnualFees}</td>
                          <td>{student.specialScholarshipFromInstitute}</td>
                          <td>{student.MUPresidentsSpecialScholarship}</td>
                          <td>{student.netAnnualFeePayable}</td>
                          <td>
                            <div className="d-flex gap-2 justify-content-around">
                              <EditButton
                                studentOrCourse="student"
                                id={student._id}
                              />
                              <DeleteButton
                                studentOrCourse="student"
                                id={student._id}
                                onDelete={handleDelete}
                              />
                              <OfferLetterButton studentData={student} />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="14" className="text-center">
                          No students found
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>
            </div>
            <div className="row justify-content-between">
              <div className="col-md-8">
                <nav aria-label="Pagination">
                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        pageNumber === 0 ? "disabled" : ""
                      }`}
                    >
                      <button className="page-link" onClick={gotoPrevious}>
                        Previous
                      </button>
                    </li>
                    {pages.map((pageIndex) => (
                      <li
                        key={pageIndex}
                        className={`page-item ${
                          pageNumber === pageIndex ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          key={pageIndex}
                          onClick={() => setPageNumber(pageIndex)}
                        >
                          {pageIndex + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        pageNumber >= numberOfPages - 1 ? "disabled" : ""
                      }`}
                    >
                      <button className="page-link" onClick={gotoNext}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="col-md-4">
                <p className="filtered-count">
                  Showing {visibleCount} of {filteredCount} records
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDetails;
