import React from "react";
import { Alert } from "react-bootstrap";

const Error = ({ display, message }) => {
  return (
    <Alert variant="primary" className="alert-class" show={display}>
      {message}
    </Alert>
  );
};

export default Error;
