import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const EditButton = ({ studentOrCourse, id }) => {
  return (
    <Link
      to={`/${(studentOrCourse += "s")}/edit/${id}`}
      className="btn btn-edit px-1"
      data-bs-toggle="tooltip" title="Edit Record"
    >
      <FontAwesomeIcon icon={faPencil} />
    </Link>
  );
};

export default EditButton;
