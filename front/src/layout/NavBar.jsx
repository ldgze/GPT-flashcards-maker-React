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
        addError({
          msg: "Logout successful. Please enter your credentials. The default username is 'user' and the default password is 'password'",
          type: "info",
          timeout: 5000,
        });
        navigate("/login"); // Redirect to login page after successful logout
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleExportCards = async () => {
    try {
      const res = await fetch("/api/cards?exportAll=true");
      if (res.status !== 200) {
        addError({ msg: "Error loading cards", type: "danger" });
        return;
      }
      const cards = await res.json();

      const sanitizedCards = cards.map(({ question, answer }) => ({
        question,
        answer,
      }));
      const jsonData = JSON.stringify(sanitizedCards, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "flashcards.json";
      a.click();
      URL.revokeObjectURL(url); // Clean up to avoid memory leaks
      addError({ msg: "Cards exported successfully", type: "success" });
    } catch (error) {
      console.error("Error exporting cards:", error);
      addError({ msg: "Error exporting cards", type: "danger" });
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
              <button
                className="nav-link btn btn-link"
                onClick={handleExportCards}
                id="export-cards"
              >
                Export All Cards
              </button>
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
