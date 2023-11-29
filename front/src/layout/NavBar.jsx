import { Link } from "react-router-dom";

export function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link to="/" className="navbar-brand">
          GPT Flashcards Maker
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/export-cards" className="nav-link" id="export-cards">
                Export All Cards
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Account Options
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link to="/logout" className="dropdown-item" id="logout">
                    Logout
                  </Link>
                </li>
                <li>
                  <Link
                    to="/update-account"
                    className="dropdown-item"
                    id="update-account"
                  >
                    Update Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/delete-account"
                    className="dropdown-item"
                    id="delete-account"
                  >
                    Delete Account
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
