import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorContext } from "../main";

export function NavBar() {
  const navigate = useNavigate();
  const { addError, clearErrors } = useContext(ErrorContext);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        clearErrors();
        addError({ msg: "Logout successful", type: "success" });
        addError({
          msg: "Please enter your credentials. If you don't have an account, please register first.",
          type: "info",
        });
        addError({
          msg: "The default username is 'user' and the default password is 'password'",
          type: "info",
        });
        navigate("/login"); // Redirect to login page after successful logout
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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
            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={handleLogout}
                id="logout"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
