import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../style/ErrorMessage.css";

export function ErrorMessage({
  children,
  type = "warning",
  onClose,
  duration = 3000,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    console.log("Message", duration);
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration); // Use the duration prop here

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [onClose, duration]); // Add duration to the dependency array

  if (!visible) return null;

  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
    >
      {children}
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={onClose}
      ></button>
    </div>
  );
}

ErrorMessage.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  onClose: PropTypes.func,
  duration: PropTypes.number, // Add duration to PropTypes
};
