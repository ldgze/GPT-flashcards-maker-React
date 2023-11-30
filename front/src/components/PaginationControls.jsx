import propTypes from "prop-types";

export const PaginationControls = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const maxPageButtons = 5; // Max number of page buttons to display

  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {currentPage > 1 && (
          <>
            <li className="page-item">
              <button className="page-link" onClick={() => setCurrentPage(1)}>
                First
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
            </li>
          </>
        )}

        {startPage > 1 && (
          <li className="page-item">
            <span className="page-link">...</span>
          </li>
        )}

        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${page === currentPage ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => setCurrentPage(page)}>
              {page}
            </button>
          </li>
        ))}

        {endPage < totalPages && (
          <li className="page-item">
            <span className="page-link">...</span>
          </li>
        )}

        {currentPage < totalPages && (
          <>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => setCurrentPage(totalPages)}
              >
                Last
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

PaginationControls.propTypes = {
  currentPage: propTypes.number.isRequired,
  setCurrentPage: propTypes.func.isRequired,
  totalPages: propTypes.number.isRequired,
};
