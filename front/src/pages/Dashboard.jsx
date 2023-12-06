import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorContext } from "../main";
import { CardsGallery } from "../components/CardsGallery";
import BasePage from "./BasePage";
import CreateCardForm from "../components/CreateCardForm";
import GenerateCardsForm from "../components/GenerateCardsForm";

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const { addError, clearErrors } = useContext(ErrorContext);
  const navigate = useNavigate(); // Initialize useNavigate
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // You can adjust this as needed
  const [sortField, setSortField] = useState("createdate");
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' for ascending
  const [totalPages, setTotalPages] = useState(1);

  // Use useCallback to memoize fetchTotalPages
  const fetchTotalPages = useCallback(async () => {
    try {
      const res = await fetch("/api/cards/count");
      if (res.status !== 200) {
        return;
      }
      const totalCards = await res.json();
      setTotalPages(Math.ceil(totalCards / pageSize));
    } catch (error) {
      console.error(error);
      addError({ msg: "Error occurred", type: "danger" });
    }
  }, [addError, pageSize]); // Dependencies for useCallback

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
      await fetchTotalPages();
    } catch (error) {
      console.error(error);
      addError({ msg: "Error occurred", type: "danger" });
    }
  }, [
    clearErrors,
    addError,
    navigate,
    currentPage,
    sortField,
    sortOrder,
    pageSize,
    fetchTotalPages,
  ]);

  useEffect(() => {
    reloadCards();
  }, [reloadCards, currentPage, sortField, sortOrder]);

  // useEffect to update totalPages when cards array changes
  useEffect(() => {
    fetchTotalPages();
  }, [cards, addError, pageSize, fetchTotalPages]); // Dependency array includes 'cards'

  return (
    <BasePage>
      <div className="d-flex justify-content-between">
        <div className="flex-grow-1 me-2">
          <CardsGallery
            cards={cards}
            reloadCards={reloadCards}
            setSortField={setSortField}
            setSortOrder={setSortOrder}
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
