import PropTypes from "prop-types";
import { ErrorContext } from "../main";
import { useContext } from "react";
export function SortingControls({ setSortField, setSortOrder }) {
  const { addError, clearErrors } = useContext(ErrorContext);

  const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    clearErrors();
    addError({ msg: `Sorted by ${field} ${order}`, type: "info" });
  };

  return (
    <div className="sorting-controls mb-3">
      <div className="btn-group" role="group" aria-label="Sorting Options">
        <button
          className="btn btn-outline-primary"
          onClick={() => handleSortChange("createdate", "asc")}
        >
          Sort by Date Asc
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={() => handleSortChange("createdate", "desc")}
        >
          Sort by Date Desc
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
