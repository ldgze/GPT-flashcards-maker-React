import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { ErrorContext } from "../main";
import { CardsGallery } from "../components/CardsGallery";
import BasePage from "./BasePage";
import CreateCardForm from "../components/CreateCardForm"; // Import the new component

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const { addError, clearErrors } = useContext(ErrorContext);
  const navigate = useNavigate(); // Initialize useNavigate
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // You can adjust this as needed
  const [sortField, setSortField] = useState("createdate");
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' for ascending

  const reloadCards = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/cards?page=${currentPage}&limit=${pageSize}&sortBy=${sortField}&order=${sortOrder}`,
      );
      if (res.status === 401) {
        clearErrors();
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
  }, [clearErrors, addError, navigate, currentPage, sortField, sortOrder]);
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
          <CardsGallery
            cards={cards}
            reloadCards={reloadCards}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setSortField={setSortField}
            setSortOrder={setSortOrder}
          />
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
