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
    academicYear: [],
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
  const [showAcademicYearCollapse, setShowAcademicYearCollapse] =
    useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);

  const pages = new Array(numberOfPages).fill(null).map((v, i) => i);

  const initialFetchRef = useRef({
    students: true,
    courses: true,
    countries: true,
  });

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
            academicYear: filters.academicYear.join(","),
            search: searchQuery,
          };

          const response = await axios.get(
            `/api/students/get?page=${pageNumber}`,
            {
              params: filterParams,
            }
          );
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
  }, [pageNumber, filters, searchQuery]);

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
      academicYear: [],
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

  // const filteredStudents = studentData.filter((student) => {
  //   const academicYear = getAcademicYear(student.studentId);
  //   return (
  //     (filters.countryName.length === 0 ||
  //       filters.countryName.includes(student.countryName)) &&
  //     (filters.qualification.length === 0 ||
  //       filters.qualification.includes(student.qualification)) &&
  //     (filters.courseOfStudy.length === 0 ||
  //       filters.courseOfStudy.includes(student.courseOfStudy)) &&
  //     (filters.duration.length === 0 ||
  //       filters.duration.includes(student.duration.toString())) &&
  //     (filters.academicYear.length === 0 ||
  //       filters.academicYear.includes(academicYear)) &&
  //     student.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedStudents = [...studentData].sort((a, b) => {
    const columnA = sortColumn ? a[sortColumn] : null;
    const columnB = sortColumn ? b[sortColumn] : null;

    if (typeof columnA === "string" && typeof columnB === "string") {
      const comparison = columnA.localeCompare(columnB);
      return sortDirection === "asc" ? comparison : -comparison;
    } else {
      const comparison = columnA > columnB ? 1 : columnA < columnB ? -1 : 0;
      return sortDirection === "asc" ? comparison : -comparison;
    }
  });

  const visibleCount = sortedStudents.length;

  useEffect(() => {
    if (visibleCount === 0 && filteredCount !== 0) {
    setPageNumber(Math.max(0, pageNumber - 1));
    }
  }, [visibleCount]);

  // aane as component kri leje
  const handleDownload = () => {
    const filterParams = {
      page: pageNumber,
      countryName: filters.countryName.join(","),
      qualification: filters.qualification.join(","),
      courseOfStudy: filters.courseOfStudy.join(","),
      duration: filters.duration.join(","),
      academicYear: filters.academicYear.join(","),
      search: searchQuery,
    };

    if (filteredCount === 0) {
      toast.info("No data to download");
      return;
    }

    axios({
      url: '/api/students/download-excel', // Adjust the URL to your API endpoint
      method: 'GET',
      params: filterParams,
      responseType: 'blob' // Important for handling binary data
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Students.xlsx');
      document.body.appendChild(link);
      link.click();
    }).catch((error) => {
      console.error('Error downloading file:', error);
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

          <button
            className="btn"
            type="button"
            onClick={handleDownload}>
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
                    <label htmlFor={countryName}>{countryName}</label>
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
                className={`collapse${showQualificationCollapse ? " show" : ""
                  } mb-3`}
                id="qualificationCollapse"
              >
                {filterData.qualifications?.sort().map((qualification, index) => (
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
                    <label htmlFor={qualification}>{qualification}</label>
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
                    <label htmlFor={courseOfStudy}>{courseOfStudy}</label>
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
                className={`collapse${showDurationCollapse ? " show" : ""
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
                    <label htmlFor={duration}>{duration}</label>
                  </div>
                ))}
              </div>
            </div>
            {/* Academic Year Filter */}
            <div>
              <button
                className="btn-filter-category text-decoration-none d-flex justify-content-between align-items-center"
                type="button"
                onClick={() =>
                  setShowAcademicYearCollapse(!showAcademicYearCollapse)
                }
              >
                Academic Year
                <FontAwesomeIcon
                  icon={
                    showAcademicYearCollapse ? faChevronRight : faChevronDown
                  }
                  className="ms-1 small"
                />
              </button>
              <div
                className={`collapse${showAcademicYearCollapse ? " show" : ""
                  } mb-3`}
                id="academicYearCollapse"
              >
                {Array.from(
                  new Set(
                    studentData.map((student) =>
                      getAcademicYear(student.studentId)
                    )
                  )
                ).sort().map((academicYear, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      id={academicYear}
                      value={academicYear}
                      checked={filters.academicYear.includes(academicYear)}
                      onChange={() =>
                        handleFilterChange("academicYear", academicYear)
                      }
                    />
                    <label htmlFor={academicYear}>{academicYear}</label>
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
                      Student ID{" "}
                      {sortColumn === "studentId" ? (
                        <FontAwesomeIcon
                          icon={sortDirection === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("studentName")}>
                      Student Name{" "}
                      {sortColumn === "studentName" ? (
                        <FontAwesomeIcon
                          icon={sortDirection === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("countryName")}>
                      Country{" "}
                      {sortColumn === "countryName" ? (
                        <FontAwesomeIcon
                          icon={sortDirection === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("qualification")}>
                      Qualification{" "}
                      {sortColumn === "qualification" ? (
                        <FontAwesomeIcon
                          icon={sortDirection === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("courseOfStudy")}>
                      Course Of Study{" "}
                      {sortColumn === "courseOfStudy" ? (
                        <FontAwesomeIcon
                          icon={sortDirection === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("duration")}>
                      Duration (in Years){" "}
                      {sortColumn === "duration" ? (
                        <FontAwesomeIcon
                          icon={sortDirection === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("totalAnnualTuitionFee")}>
                      Total Annual Tuition Fee{" "}
                      {sortColumn === "totalAnnualTuitionFee" ? (
                        <FontAwesomeIcon
                          icon={sortDirection === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("hostelMessAndOtherFees")}>
                      Hostel, Mess and Other Fees{" "}
                      {sortColumn === "hostelMessAndOtherFees" ? (
                        <FontAwesomeIcon
                          icon={sortDirection === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("totalAnnualFees")}>
                      Total Annual Fees{" "}
                      {sortColumn === "totalAnnualFees" ? (
                        <FontAwesomeIcon
                          icon={sortDirection === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th
                      onClick={() =>
                        handleSort("specialScholarShipFromInstitute")
                      }
                    >
                      Special Scholarship from Institute{" "}
                      {sortColumn === "specialScholarshipFromInstitute" ? (
                        <FontAwesomeIcon
                          icon={sortDirection === "asc" ? faSortUp : faSortDown}
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
                      MU President's Special Scholarship{" "}
                      {sortColumn === "MUPresidentsSpecialScholarship" ? (
                        <FontAwesomeIcon
                          icon={sortDirection === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("netAnnualFeePayable")}>
                      Net Annual Fee Payable{" "}
                      {sortColumn === "netAnnualFeePayable" ? (
                        <FontAwesomeIcon
                          icon={sortDirection === "asc" ? faSortUp : faSortDown}
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
                    {sortedStudents.length > 0 ? (
                      sortedStudents.map((student, index) => (
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
                      className={`page-item ${pageNumber === 0 ? "disabled" : ""
                        }`}
                    >
                      <button className="page-link" onClick={gotoPrevious}>
                        Previous
                      </button>
                    </li>
                    {pages.map((pageIndex) => (
                      <li
                        key={pageIndex}
                        className={`page-item ${pageNumber === pageIndex ? "active" : ""
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
                      className={`page-item ${pageNumber >= numberOfPages - 1 ? "disabled" : ""
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
