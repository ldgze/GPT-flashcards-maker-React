import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { ErrorContext } from "../main";
import "../style/SortingControls.css";

export function SortingControls({
  setSortField,
  setSortOrder,
  setIsSortOperation,
}) {
  const { clearErrors } = useContext(ErrorContext);
  const [activeSort, setActiveSort] = useState("");

  const sortOptions = [
    {
      field: "createdate",
      order: "asc",
      emoji: "⬆️",
      tooltip: "Sort Oldest to Newest",
    },
    {
      field: "createdate",
      order: "desc",
      emoji: "⬇️",
      tooltip: "Sort Newest to Oldest",
    },
    // Add other sorting options here
  ];

  const handleSortChange = (option) => {
    // Update the sorting fields and state first
    setSortField(option.field);
    setSortOrder(option.order);
    setActiveSort(`${option.field}-${option.order}`);

    // Clear any previous errors
    clearErrors();

    setIsSortOperation(true); // Indicate that a sort operation has started
  };

  const getButtonClass = (option) => {
    const fieldOrder = `${option.field}-${option.order}`;
    return `btn ${activeSort === fieldOrder ? "btn-active" : "btn-inactive"}`;
  };

  return (
    <div className="sorting-controls mb-3">
      <div className="btn-group" role="group" aria-label="Sorting Options">
        {sortOptions.map((option) => (
          <button
            key={`${option.field}-${option.order}`}
            className={getButtonClass(option)}
            onClick={() => handleSortChange(option)}
            title={option.tooltip} // Adding the tooltip here
          >
            {option.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

SortingControls.propTypes = {
  setSortField: PropTypes.func.isRequired,
  setSortOrder: PropTypes.func.isRequired,
  setIsSortOperation: PropTypes.func.isRequired,
};
