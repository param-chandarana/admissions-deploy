import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentTable = () => {
  const PAGE_SIZE = 10;
  const [students, setStudents] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState("studentId"); // Default sort by studentId
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order ascending

  // Fetch students based on current page, sort field, and sort order
  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/students", {
        params: {
          page: currentPage,
          sortField,
          sortOrder,
        },
      });
      setStudents(response.data.students);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching sorted students:", error);
    }
  };

  // Fetch students whenever currentPage, sortField, or sortOrder changes
  useEffect(() => {
    fetchStudents();
  }, [currentPage, sortField, sortOrder]);

  // Change page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle sorting
  const handleSortChange = (field) => {
    if (field === sortField) {
      // Toggle sort order if sorting by the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and reset to ascending order
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div>
      <h2>Student List</h2>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSortChange("studentId")}>Student ID</th>
            <th onClick={() => handleSortChange("studentName")}>
              Student Name
            </th>
            <th onClick={() => handleSortChange("countryName")}>Country</th>
            <th onClick={() => handleSortChange("qualification")}>
              Qualification
            </th>
            <th onClick={() => handleSortChange("courseOfStudy")}>
              Course of Study
            </th>
            <th onClick={() => handleSortChange("duration")}>Duration</th>
            <th onClick={() => handleSortChange("totalAnnualTuitionFee")}>
              Tuition Fee
            </th>
            <th onClick={() => handleSortChange("netAnnualFeePayable")}>
              Net Annual Fee
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{student.studentName}</td>
              <td>{student.countryName}</td>
              <td>{student.qualification}</td>
              <td>{student.courseOfStudy}</td>
              <td>{student.duration}</td>
              <td>{student.totalAnnualTuitionFee}</td>
              <td>{student.netAnnualFeePayable}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentTable;
