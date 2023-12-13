import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../style/ErrorMessage.css";

export function ErrorMessage({ children, type = "warning", onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 2000); // Message disappears after 5000 milliseconds (5 seconds)

    return () => clearTimeout(timer); // Clear the timer if the component unmounts
  }, [onClose]);

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
};
