import { useState, useContext } from "react";
import { ErrorContext } from "../main";
import PropTypes from "prop-types";
import { SortingControls } from "./SortingControls";
import { PaginationControls } from "./PaginationControls";

export function CardsGallery({
  cards,
  reloadCards,
  setSortField,
  setSortOrder,
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  console.log("👏🏻 Render CardsGallery cards=", cards);

  const [editingCard, setEditingCard] = useState(null);
  const { addError } = useContext(ErrorContext);

  const startEditing = (card) => {
    setEditingCard({ ...card });
  };

  const handleEditChange = (event) => {
    setEditingCard({ ...editingCard, [event.target.name]: event.target.value });
  };

  const saveCard = async () => {
    try {
      const response = await fetch("/api/cards/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingCard),
      });
      if (response.status === 400) {
        addError({
          msg: "Card unchanged. Please choose a different question or answer.",
          type: "danger",
        });
      } else if (!response.ok) {
        addError({
          msg: "Error updating card.",
          type: "danger",
        });
      } else {
        addError({
          msg: "Card updated.",
          type: "success",
        });
        // Refresh cards list after save
        reloadCards();
      }

      setEditingCard(null);
    } catch (error) {
      console.error("Error saving card:", error);
    }
  };

  const deleteCard = async (cardId) => {
    try {
      const response = await fetch("/api/cards/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: cardId }),
      });
      if (!response.ok) {
        addError({
          msg: "Error deleting card.",
          type: "danger",
        });
      }
      addError({
        msg: "Card deleted.",
        type: "success",
      });
      // Refresh cards list after delete
      // ...
      reloadCards();
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  function renderCards() {
    function renderCard(card) {
      const isEditing = editingCard && editingCard._id === card._id;

      return (
        <div className="card mb-3" key={card._id}>
          <div className="card-body">
            <h5 className="card-title">Question</h5>
            {isEditing ? (
              <input
                type="text"
                name="question"
                value={editingCard.question}
                onChange={handleEditChange}
              />
            ) : (
              <p className="card-text" id="cardQuestion">
                {card.question}
              </p>
            )}
            <h5 className="card-title">Answer</h5>
            {isEditing ? (
              <input
                type="text"
                name="answer"
                value={editingCard.answer}
                onChange={handleEditChange}
              />
            ) : (
              <p className="card-text" id="cardAnswer">
                {card.answer}
              </p>
            )}
            <div className="btn-group">
              {isEditing ? (
                <button onClick={saveCard} className="btn btn-success">
                  Save
                </button>
              ) : (
                <button
                  onClick={() => startEditing(card)}
                  className="btn btn-primary"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => deleteCard(card._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      );
    }

    return cards.map(renderCard);
  }

  return (
    <div className="cards-gallery">
      <h2>My Flashcards</h2>

      <div className="d-flex sticky-controls justify-content-between align-items-center mb-3">
        {/* SortingControls */}
        <SortingControls
          setSortField={setSortField}
          setSortOrder={setSortOrder}
        />

        {/* PaginationControls */}
        <PaginationControls
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>

      <div id="cards">{renderCards()}</div>
    </div>
  );
}

CardsGallery.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    }),
  ),
  reloadCards: PropTypes.func.isRequired,
  setSortField: PropTypes.func.isRequired,
  setSortOrder: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};
