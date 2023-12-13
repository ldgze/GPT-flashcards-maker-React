import { useState, useContext } from "react";
import { ErrorContext } from "../main";
import PropTypes from "prop-types";

export default function GenerateCardsForm({ onCardsGenerated }) {
  const [text, setText] = useState("");
  const [number, setNumber] = useState(1);
  const { addError } = useContext(ErrorContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/cards/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, number }),
      });

      console.log("Response:", response);

      if (!response.ok) {
        addError({ msg: "Failed to generate cards", type: "danger" });
        return;
      }

      const generatedCards = await response.json();
      onCardsGenerated(); // Call this to reload the card list
      addError({
        msg: `${generatedCards.length} cards generated successfully`,
        type: "success",
      });
    } catch (error) {
      console.error("Error:", error);
      addError({ msg: error.message, type: "danger" });
    }
  };

  return (
    <div className="card my-4 generate-cards-form">
      <div className="card-body">
        <h2 className="card-title">Generate New Cards</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="text" className="form-label">
              Text:
            </label>
            <textarea
              id="text"
              className="form-control"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter any text you want to use for generating flashcards. eg: 'The quick brown fox jumps over the lazy dog.'"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="number" className="form-label">
              Number of Cards:
            </label>
            <input
              type="number"
              className="form-control"
              id="number"
              value={number}
              min="1"
              max="10"
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Choose how many cards to generate (1-10)."
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Generate Cards
          </button>
        </form>
      </div>
    </div>
  );
}

GenerateCardsForm.propTypes = {
  onCardsGenerated: PropTypes.func.isRequired,
};
