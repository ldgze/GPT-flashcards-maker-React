import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { ErrorContext } from "../main";
import { CardsGallery } from "../components/CardsGallery";
import BasePage from "./BasePage";
import CreateCardForm from "../components/CreateCardForm";
import GenerateCardsForm from "../components/GenerateCardsForm"; // Import the new component
import { PaginationControls } from "../components/PaginationControls";

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const { addError, clearErrors } = useContext(ErrorContext);
  const navigate = useNavigate(); // Initialize useNavigate
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // You can adjust this as needed
  const [sortField, setSortField] = useState("createdate");
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' for ascending
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    reloadCards();
  }, [reloadCards, currentPage, sortField, sortOrder]);

  useEffect(() => {
    const fetchTotalPages = async () => {
      try {
        const res = await fetch("/api/cards/count");
        if (res.status !== 200) {
          // addError({ msg: "Error fetching total cards", type: "danger" });
          return;
        }
        const totalCards = await res.json();
        setTotalPages(Math.ceil(totalCards / pageSize));
      } catch (error) {
        console.error(error);
        addError({ msg: "Error occurred", type: "danger" });
      }
    };
    fetchTotalPages();
  }, [addError]);

  return (
    <BasePage>
      <div className="d-flex justify-content-between">
        <div className="flex-grow-1 me-2">
          <CardsGallery
            cards={cards}
            reloadCards={reloadCards}
            setSortField={setSortField}
            setSortOrder={setSortOrder}
          />
          <PaginationControls
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
        <div className="flex-shrink-0 sticky-form" style={{ width: "300px" }}>
          <CreateCardForm onCardCreated={reloadCards} />
          <GenerateCardsForm onCardsGenerated={reloadCards} />{" "}
          {/* Add the GenerateCardsForm here */}
        </div>
      </div>
    </BasePage>
  );
}
