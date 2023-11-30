import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { ErrorContext } from "../main";

export function SortingControls({ setSortField, setSortOrder }) {
  const { addError, clearErrors } = useContext(ErrorContext);
  const [activeSort, setActiveSort] = useState("");

  const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    setActiveSort(`${field}-${order}`);
    clearErrors();
    addError({ msg: `Sorted by ${field} ${order}`, type: "info" });
  };

  const getButtonClass = (fieldOrder) => {
    return `btn ${
      activeSort === fieldOrder
        ? "btn-primary"
        : "btn-outline-primary inactive-button"
    }`;
  };

  return (
    <div className="sorting-controls mb-3">
      <div className="btn-group" role="group" aria-label="Sorting Options">
        <button
          className={getButtonClass("createdate-asc")}
          onClick={() => handleSortChange("createdate", "asc")}
        >
          Oldest to Newest
        </button>
        <button
          className={getButtonClass("createdate-desc")}
          onClick={() => handleSortChange("createdate", "desc")}
        >
          Newest to Oldest
        </button>
        {/* Add other sorting buttons/options here */}
      </div>
    </div>
  );
}

SortingControls.propTypes = {
  setSortField: PropTypes.func.isRequired,
  setSortOrder: PropTypes.func.isRequired,
};
