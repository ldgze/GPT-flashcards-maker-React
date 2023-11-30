import "dotenv/config"; // to load .env file
import { MongoClient, ObjectId } from "mongodb";

function MyDB() {
  const uri = process.env.MONGODB_URI;
  const myDB = {};

  const connect = () => {
    console.log("Connecting to", uri.slice(0, 20));
    const client = new MongoClient(uri);
    const db = client.db("flashcardsMaker");

    return { client, db };
  };

  myDB.getCardsByUsername = async (
    username,
    page = 1,
    limit = 10,
    sortBy = "createdate",
    order = "desc",
  ) => {
    const { client, db } = connect();
    const cardsCollection = db.collection("cards");

    const skips = limit * (page - 1);
    const sortOrder = order === "asc" ? 1 : -1;

    try {
      const queryObj = {
        "user.username": username,
      };
      return await cardsCollection
        .find(queryObj)
        .sort({ [sortBy]: sortOrder })
        .skip(skips)
        .limit(limit)
        .toArray();
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.getCardsNumberByUsername = async (username) => {
    const { client, db } = connect();
    const cardsCollection = db.collection("cards");

    try {
      const queryObj = {
        "user.username": username,
      };
      return await cardsCollection.countDocuments(queryObj);
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.insertCard = async (card, username) => {
    const { client, db } = connect();
    const cardsCollection = db.collection("cards");
    const user = await myDB.getUserByUsername(username);
    const createdate = new Date();
    console.log("card:", card);

    try {
      await cardsCollection.insertOne({
        question: card.question,
        answer: card.answer,
        createdate: createdate,
        user: user,
      });
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.insertManyCards = async (cards, username) => {
    const { client, db } = connect();
    const cardsCollection = db.collection("cards");
    const user = await myDB.getUserByUsername(username);
    const createdate = new Date();
    console.log("cards:", cards);
    try {
      await cardsCollection.insertMany(
        cards.map((card) => ({
          question: card.question,
          answer: card.answer,
          createdate: createdate,
          user: user,
        })),
      );
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.deleteCardByID = async (card_id) => {
    console.log("deleteCardByID card_id:", card_id);
    const { client, db } = connect();
    const cardsCollection = db.collection("cards");
    const queryObj = {
      _id: new ObjectId(card_id._id),
    };

    try {
      await cardsCollection.deleteOne(queryObj);
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.getCardByID = async (card_id) => {
    const { client, db } = connect();
    const cardsCollection = db.collection("cards");
    const queryObj = {
      _id: new ObjectId(card_id),
    };
    try {
      return await cardsCollection.findOne(queryObj);
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.updateCardByID = async (card) => {
    const { client, db } = connect();
    const cardsCollection = db.collection("cards");
    console.log("hello card:", card);
    const filter = {
      _id: new ObjectId(card._id),
    };
    const update = { $set: { question: card.question, answer: card.answer } };

    try {
      const result = await cardsCollection.updateOne(filter, update);

      if (result.modifiedCount > 0) {
        console.log("Document updated successfully");
      } else if (result.matchedCount === 0) {
        throw new Error("Document not found");
      } else {
        throw new Error("Document found but not updated");
      }
    } catch (err) {
      console.error("Error updating card:", err);
      throw err; // Re-throw the error to be caught by the caller
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.insertUser = async (user) => {
    const { client, db } = connect();
    const usersCollection = db.collection("users");

    try {
      await usersCollection.insertOne(user);
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.getUserByUsername = async (username) => {
    const { client, db } = connect();

    const usersCollection = db.collection("users");

    try {
      return await usersCollection.findOne({ username });
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.deleteUserByUsername = async (username) => {
    const { client, db } = connect();
    const usersCollection = db.collection("users");
    const cardsCollection = db.collection("cards");
    const queryObj = {
      username: username,
    };
    console.log("queryObj:", queryObj);
    try {
      await usersCollection.deleteOne(queryObj);
      await cardsCollection.deleteMany({ "user.username": username });
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.updateUserByUsername = async (username, newUsername, password) => {
    const { client, db } = connect();

    const usersCollection = db.collection("users");
    const cardsCollection = db.collection("cards");
    const user = { username: newUsername, password: password };

    try {
      await usersCollection.findOneAndUpdate(
        { username: username },
        { $set: user },
        { returnOriginal: false },
      );
      await cardsCollection.updateMany(
        { "user.username": username },
        { $set: { user: user } },
      );
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.getUserCollection = () => {
    const { client, db } = connect();
    const usersCollection = db.collection("users");

    try {
      return usersCollection;
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  return myDB;
}

const myDB = MyDB();
export default myDB;
