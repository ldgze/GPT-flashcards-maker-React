import { useContext } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import { PropTypes } from "prop-types";

import { ErrorMessage } from "../components/ErrorMessage";
import { NavBar } from "../layout/NavBar";
import { Footer } from "../layout/Footer";

import { ErrorContext } from "../main";

export default function BasePage({ children }) {
  const { errors, removeError } = useContext(ErrorContext);
  const location = useLocation(); // Use the useLocation hook

  // Function to check if the current route is Dashboard
  const isDashboard = location.pathname === "/";

  return (
    <>
      {isDashboard && <NavBar />}
      <div className="error-message-wrapper">
        {errors.map((error, index) => (
          <ErrorMessage
            key={index}
            type={error.type}
            onClose={() => removeError(index)}
          >
            <strong>{error.msg}</strong>
          </ErrorMessage>
        ))}
      </div>
      {children}
      {isDashboard && <Footer />}
    </>
  );
}

BasePage.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
