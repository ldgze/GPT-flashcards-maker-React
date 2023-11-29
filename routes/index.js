import express from "express";
import myDB from "../db/MyDB.js";
let router = express.Router();

router.get("/api/cards", async (req, res) => {
  if (req.user) {
    const username = req.user.username;

    try {
      const cards = await myDB.getCardsByUsername(username);

      res.status(200).json(cards);
    } catch (error) {
      console.error("Error fetching user's cards:", error);

      res.status(500).send("An error occurred while fetching user's cards");
    }
  } else {
    return res.status(401).json({ message: "Not authorized" });
  }
});

router.post("/api/cards/create", async (req, res) => {
  if (req.user) {
    const username = req.user.username;

    const { question, answer } = req.body;
    const card = { question, answer };

    try {
      await myDB.insertCard(card, username);

      res.send("Card created successfully");
    } catch (error) {
      console.error("Error creating card:", error);

      res.status(500).send("An error occurred while creating the card");
    }
  } else {
    res.redirect("/login");
  }
});

router.delete("/api/cards/delete", async (req, res) => {
  if (req.user) {
    const _id = req.body;

    try {
      await myDB.deleteCardByID(_id);

      res.send("Card deleted successfully");
    } catch (error) {
      console.error("Error deleting card:", error);

      res.status(500).send("An error occurred while deleting the card");
    }
  } else {
    res.redirect("/login");
  }
});

router.post("/api/cards/update", async (req, res) => {
  if (req.user) {
    const { _id, question, answer } = req.body;
    const card = { _id, question, answer };

    try {
      const existingCard = await myDB.getCardByID(_id);

      if (
        existingCard.question === question &&
        existingCard.answer === answer
      ) {
        return res
          .status(400)
          .send(
            "Card unchanged. Please choose a different question or answer.",
          );
      }

      await myDB.updateCardByID(card);

      res.send("Card updated successfully");
    } catch (error) {
      console.error("Error updating card:", error);

      res.status(500).send("An error occurred while updating the card");
    }
  } else {
    res.redirect("/login");
  }
});

export default router;
