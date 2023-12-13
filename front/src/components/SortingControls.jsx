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
      symbol: "↑",
      tooltip: "Sort Oldest to Newest",
    },
    {
      field: "createdate",
      order: "desc",
      symbol: "↓",
      tooltip: "Sort Newest to Oldest",
    },
    // Add other sorting options here
  ];

  const handleSortChange = (option) => {
    setSortField(option.field);
    setSortOrder(option.order);
    setActiveSort(`${option.field}-${option.order}`);
    clearErrors();
    setIsSortOperation(true);
  };

  return (
    <div className="sorting-controls mb-3">
      <div className="btn-group" role="group" aria-label="Sorting Options">
        {sortOptions.map((option) => (
          <button
            key={`${option.field}-${option.order}`}
            className={`btn ${
              activeSort === `${option.field}-${option.order}`
                ? "btn-active"
                : "btn-inactive"
            }`}
            onClick={() => handleSortChange(option)}
            title={option.tooltip}
          >
            {option.symbol}
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
