import { useState, useContext } from "react";
import { ErrorContext } from "../main";
import PropTypes from "prop-types"; // Import PropTypes

export default function CreateCardForm({ onCardCreated }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const { addError } = useContext(ErrorContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Call the API to create a new card
    try {
      const response = await fetch("/api/cards/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, answer }),
      });
      if (response.ok) {
        addError({ msg: "Card created", type: "success", duration: 1000 });
        onCardCreated(); // Callback to refresh the card list
      } else {
        // Handle errors
        addError({ msg: "Error creating card", type: "danger" });
        console.error("Failed to create card");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="card my-4 create-card-form">
      <div className="card-body">
        <h2 className="card-title">Create a New Card</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="question" className="form-label">
              Question
            </label>
            <input
              type="text"
              className="form-control"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter question"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="answer" className="form-label">
              Answer
            </label>
            <input
              type="text"
              className="form-control"
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter answer"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Card
          </button>
        </form>
      </div>
    </div>
  );
}

CreateCardForm.propTypes = {
  onCardCreated: PropTypes.func.isRequired, // Define the prop type
};
