import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import crypto from "crypto";
import myDB from "../db/MyDB.js";

const router = express.Router();

const myStrategy = new LocalStrategy(async function verify(
  username,
  password,
  cb,
) {
  try {
    console.log("verifying", username, password);
    const user = await myDB.getUserByUsername(username);

    if (!user) {
      // User not found
      cb(null, false, { message: "Incorrect username or password" });
      return false;
    }

    console.log("found user", user);

    // Computes the hash password from the user input
    crypto.pbkdf2(
      password,
      Buffer.from(user.salt, "hex"),
      310000,
      32,
      "sha256",
      function (err, hashedPassword) {
        if (err) {
          return cb(err);
        }
        if (
          !crypto.timingSafeEqual(
            Buffer.from(user.hashedPassword, "hex"),
            hashedPassword,
          )
        ) {
          console.log("passwords don't match");
          // User found but password incorrect
          cb(null, false, { message: "Incorrect username or password" });
          return false;
        }

        console.log("passwords match");
        // User found and authenticated
        cb(
          null, // error
          { username: username }, // user object
          { message: "Hello" }, // extra info
        );
      },
    );
  } catch (err) {
    cb(err);
  }
});

passport.use(myStrategy);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.post(
  "/api/login/password",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  function (req, res) {
    res.redirect("/");
  },
);

router.post("/api/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ username: null, msg: "Logged out", ok: true });
  });
});

router.get("/api/getUser", function (req, res) {
  console.log("getUser", req.user);
  res.status(200).json({ username: req.user?.username });
});

router.post("/api/signup", async function (req, res, next) {
  console.log("**** signup", req.body);

  const user = await myDB.getUserByUsername(req.body.username);
  if (user) {
    return res.status(400).json({ ok: false, msg: "Username already exists" });
  }

  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    req.body.password,
    salt,
    310000,
    32,
    "sha256",
    async function (err, hashedPassword) {
      if (err) {
        return next(err);
      }

      const user = {
        username: req.body.username,
        hashedPassword: hashedPassword.toString("hex"),
        salt: salt.toString("hex"),
      };

      const insertResponse = await myDB.insertUser(user);

      console.log("inserted", insertResponse);

      res.status(200).json({ ok: true, msg: "Signed up " });
    },
  );
});

export default router;
