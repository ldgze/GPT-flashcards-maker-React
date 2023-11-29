import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { ErrorContext } from "../main";
import { CardsGallery } from "../components/CardsGallery";
import BasePage from "./BasePage";
import CreateCardForm from "../components/CreateCardForm"; // Import the new component

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const { addError } = useContext(ErrorContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const reloadCards = useCallback(async () => {
    try {
      const res = await fetch("/api/cards");
      if (res.status === 401) {
        addError({
          msg: "Please enter your credentials. If you don't have an account, please register first.",
          type: "info",
        });
        addError({
          msg: "The default username is 'user' and the default password is 'password'",
          type: "info",
        });
        navigate("/login"); // Navigate to login on 401 status
        return;
      }
      if (res.status !== 200) {
        setCards([]);
        addError({ msg: "Error fetching photos", type: "danger" });
        return;
      }
      const cardsData = await res.json();
      setCards(cardsData);
    } catch (error) {
      console.error(error);
      addError({ msg: "Error occurred", type: "danger" });
    }
  }, [addError, navigate]); // Include navigate in the dependencies array

  const handleCardCreated = () => {
    reloadCards(); // Function to refresh the list of cards
  };

  useEffect(() => {
    reloadCards();
  }, [reloadCards]);

  return (
    <BasePage>
      <div className="d-flex justify-content-between">
        <div className="flex-grow-1 me-2">
          <CardsGallery cards={cards} reloadCards={reloadCards} />
        </div>
        <div className="flex-shrink-0" style={{ width: "300px" }}>
          {" "}
          {/* Adjust width as needed */}
          <CreateCardForm onCardCreated={handleCardCreated} />
        </div>
      </div>
    </BasePage>
  );
}
