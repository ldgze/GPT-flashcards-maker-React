import express from "express";
import myDB from "../db/MyDB.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
let router = express.Router();

router.get("/api/cards", async (req, res) => {
  if (req.user) {
    const username = req.user.username;
    const exportAll = req.query.exportAll === "true";

    try {
      let cards = [];

      if (exportAll) {
        // Fetch all cards without pagination
        cards = await myDB.getAllCardsByUsername(username);
      } else {
        // Extract query parameters for pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || "createdate";
        const order = req.query.order || "desc";

        // Fetch cards with pagination
        cards = await myDB.getCardsByUsername(
          username,
          page,
          limit,
          sortBy,
          order,
        );
      }

      // Send the cards in the response
      res.status(200).json(cards);
    } catch (error) {
      console.error("Error fetching user's cards:", error);
      res.status(500).send("An error occurred while fetching user's cards");
    }
  } else {
    return res.status(401).json({ message: "Not authorized" });
  }
});

router.get("/api/cards/count", async (req, res) => {
  if (req.user) {
    const username = req.user.username;

    try {
      const cardsNumber = await myDB.getCardsNumberByUsername(username);

      res.status(200).json(cardsNumber);
    } catch (error) {
      console.error("Error fetching user's cards number:", error);

      res
        .status(500)
        .send("An error occurred while fetching user's cards number");
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

router.post("/api/cards/generate", async (req, res) => {
  if (req.user) {
    const username = req.user.username;

    const { text, number } = req.body;

    const prompt = `
Create ${number} flashcards in a JSON-like format based on the following text. Each flashcard should be a JSON object with 'question' and 'answer' keys. Format the flashcards as an array of objects.

Text: ${text}

For example, the response should be formatted like this:
[
  { "question": "What is JavaScript?", "answer": "JavaScript is a programming language used to create interactive effects within web browsers." },
  { "question": "What are the core technologies of the World Wide Web?", "answer": "The core technologies of the World Wide Web are HTML, CSS, and JavaScript." }
  // ... other flashcards
]
`;

    // Continue with your existing fetch() code...

    console.log(prompt);
    try {
      const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });

      console.log("Response", response);

      const openAIResponse = response;
      const generatedText = openAIResponse.choices[0].message.content;
      console.log("OpenAIResponse", openAIResponse);
      console.log("GeneratedText", generatedText);
      const generatedFlashcards = JSON.parse(generatedText);
      console.log("generatedFlashcards", generatedFlashcards);
      console.log("generatedFlashcards.length", generatedFlashcards.length);
      if (generatedFlashcards.length === 0) {
        return res.status(400).send("No flashcards generated");
      }

      await myDB.insertManyCards(generatedFlashcards, username);
      res.json(generatedFlashcards);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Failed to generate cards");
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
