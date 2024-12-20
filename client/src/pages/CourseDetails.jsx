import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
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

const CourseDetails = () => {
  const [filters, setFilters] = useState({
    qualification: [],
    duration: [],
  });
  const [filterData, setFilterData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [courseData, setCourseData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showQualificationCollapse, setShowQualificationCollapse] =
    useState(false);
  const [showDurationCollapse, setShowDurationCollapse] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [sortField, setSortField] = useState("courseName"); // Default sort field courseName
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order ascending
  const [isLoading, setIsLoading] = useState(false);

  const initialFetchRef = useRef({
    courses: true,
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
    if (initialFetchRef.current.courses) {
      initialFetchRef.current.courses = false;
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const filterParams = {
            page: pageNumber,
            qualification: filters.qualification.join(","),
            duration: filters.duration.join(","),
            search: searchQuery,
            sortField: sortField || "courseName",
            sortOrder: sortOrder || "asc",
          };

          const response = await axios.get(`/api/courses/get`, {
            params: filterParams,
          });

          setCourseData(response.data.courses);
          setTotalCount(response.data.totalCourses);
          setFilteredCount(response.data.filteredCourses);
          setNumberOfPages(response.data.totalPages);
          initialFetchRef.current.courses = true;
        } catch (error) {
          toast.error("Error fetching courses");
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [pageNumber, filters, searchQuery, sortField, sortOrder]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await axios.get(`/api/courses/get-details`);
        setFilterData(response.data);
      } catch (error) {
        toast.error("Error fetching filter data");
      }
    };
    if (!initialFetchRef.current) {
      initialFetchRef.current = true;
      fetchFilterData();
    } else {
      fetchFilterData();
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

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (!isLoading) {
      setPageNumber(0);
    }
  };

  const handleDelete = (deletedCourseId) => {
    setCourseData((prev) =>
      prev.filter((courseData) => courseData._id !== deletedCourseId)
    );
  };

  const handleClearFilters = () => {
    setFilters({
      qualification: [],
      duration: [],
    });
    setSearchQuery("");
    if (!isLoading) {
      setPageNumber(0);
    }
  };

  const visibleCount = courseData.length;

  useEffect(() => {
    if (visibleCount === 0 && filteredCount !== 0) {
      setPageNumber(Math.max(0, pageNumber - 1));
    }
  }, [visibleCount]);

  return (
    <>
      <ToastContainer />
      <div className="container-fluid mt-4">
        <h1 className="h2 mb-4">Course Details</h1>
        <button
          className="btn mb-4"
          type="button"
          onClick={() => setShowOffcanvas(!showOffcanvas)}
        >
          Show Filters
        </button>
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
                placeholder="Search by Course Name"
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
                    <th onClick={() => handleSort("courseName")}>
                      Course Name{" "}
                      {sortField === "courseName" ? (
                        <FontAwesomeIcon
                          icon={sortOrder === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th onClick={() => handleSort("qualification")}>
                      Qualification{" "}
                      {sortField === "qualification" ? (
                        <FontAwesomeIcon
                          icon={sortOrder === "asc" ? faSortUp : faSortDown}
                          className="ms-1 small"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faSort} className="ms-1 small" />
                      )}
                    </th>
                    <th
                      onClick={() => handleSort("duration")}
                      data-bs-toggle="tooltip"
                      title="Sort"
                    >
                      Duration (in Years){" "}
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
                      Total Annual Tuition Fee{" "}
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
                      Hostel, Mess and Other Fees{" "}
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
                      Total Annual Fees{" "}
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
                      Special Scholarship from Institute{" "}
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
                      MU President's Special Scholarship{" "}
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
                      Net Annual Fee Payable{" "}
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
                    {courseData.length > 0 ? (
                      courseData.map((course, index) => (
                        <tr key={index}>
                          <td>{course.courseName}</td>
                          <td>{course.qualification}</td>
                          <td>{course.duration}</td>
                          <td>{course.totalAnnualTuitionFee}</td>
                          <td>{course.hostelMessAndOtherFees}</td>
                          <td>{course.totalAnnualFees}</td>
                          <td>{course.specialScholarshipFromInstitute}</td>
                          <td>{course.MUPresidentsSpecialScholarship}</td>
                          <td>{course.netAnnualFeePayable}</td>
                          <td>
                            <div className="d-flex gap-3 justify-content-around">
                              <EditButton
                                studentOrCourse="course"
                                id={course._id}
                              />
                              <DeleteButton
                                studentOrCourse="course"
                                id={course._id}
                                onDelete={handleDelete}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="14" className="text-center">
                          No courses found
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
                    {Array.from({ length: numberOfPages }, (_, index) => (
                      <li
                        key={index}
                        className={`page-item ${
                          pageNumber === index ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPageNumber(index)}
                        >
                          {index + 1}
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

export default CourseDetails;
