import express from "express";
import myDB from "../db/MyDB.js";
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

function formatToFlashcards(generatedText) {
  // Define a regular expression pattern to identify questions and answers.
  // This pattern will depend on how the text is formatted.
  // For example, if each question is prefixed by 'Q:' and each answer by 'A:', you might use:
  const pattern = /Q: (.*?) A: (.*?)(?=\nQ:|$)/gs;

  // Initialize an empty array to store flashcards
  const flashcards = [];

  // Use the pattern to extract question-answer pairs
  let match;
  while ((match = pattern.exec(generatedText)) !== null) {
    // Each match will have two groups: question and answer
    const [, question, answer] = match;

    // Push the question-answer pair as an object into the flashcards array
    flashcards.push({ question, answer });
  }

  return flashcards;
}

router.post("/api/cards/generate", async (req, res) => {
  if (req.user) {
    const username = req.user.username;

    const { text, number } = req.body;

    const prompt = `Create ${number} flashcards based on the following text, each containing a question and a corresponding answer. Ensure that these questions and answers are relevant to the text content. The text is:${text}. Format each flashcard as follows:
    Q: [question]
    A: [answer]`;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/engines/davinci/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
            max_tokens: 100, // or other parameters as needed
          }),
        },
      );
      if (!response.ok) {
        throw new Error("OpenAI API request failed");
      }

      const openAIResponse = await response.json();
      const generatedText = openAIResponse.choices[0].text;
      // Process and format the generatedText into flashcards format
      // ...
      const generatedFlashcards = formatToFlashcards(generatedText);
      try {
        await myDB.insertManyCards(generatedFlashcards, username);
        res.json(generatedFlashcards);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Failed to insert cards");
      }
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
