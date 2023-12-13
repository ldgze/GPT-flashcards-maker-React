import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorContext } from "../main";
import "../style/NavBar.css";

export function NavBar() {
  const navigate = useNavigate();
  const { addError, clearErrors } = useContext(ErrorContext);

  function convertToCSV(cards) {
    const header = Object.keys(cards[0]).join(",");
    const rows = cards.map((card) => Object.values(card).join(",")).join("\n");
    return `${header}\n${rows}`;
  }

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
          duration: 5000,
        });
        navigate("/login"); // Redirect to login page after successful logout
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleExportCards = async (format) => {
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

      let data, blob, filename;
      if (format === "json") {
        data = JSON.stringify(sanitizedCards, null, 2);
        blob = new Blob([data], { type: "application/json" });
        filename = "flashcards.json";
      } else if (format === "csv") {
        data = convertToCSV(sanitizedCards);
        blob = new Blob([data], { type: "text/csv" });
        filename = "flashcards.csv";
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      addError({
        msg: `Cards exported successfully as ${format}`,
        type: "success",
      });
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
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Export Cards
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => handleExportCards("json")}
                  >
                    Export as JSON
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => handleExportCards("csv")}
                  >
                    Export as CSV
                  </a>
                </li>
              </ul>
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
