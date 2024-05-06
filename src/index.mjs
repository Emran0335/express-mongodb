import express, { response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
// import "./strategies/local-strategy.mjs";
import "./strategies/discord-strategy.mjs";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

const app = express();
const PORT = process.env.PORT || 5000;
mongoose
  .connect(
    "mongodb+srv://emran:0335@cluster0.kwfqhr2.mongodb.net/express_tutorial"
  )
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

// general middlewares
app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "anson the dev",
    saveUninitialized: false, // false is recommended!
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

// main routes
app.use(routes);

// serialisedUser function will be called for the first time
app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  response.sendStatus(200);
});

// deserializedUser function will be called from saved session data from the request object
app.get("/api/auth/status", (request, response) => {
  console.log(`Inside api/auth/status endpoint`);
  console.log(request.user);
  console.log(request.session);
  console.log("sessionID: ", request.sessionID);
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

app.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);
  request.logout((err) => {
    if (err) return response.sendStatus(400);
    return response.send(200);
  });
});

app.get("/api/auth/discord", passport.authenticate("discord"));
app.get(
  "/api/auth/discord/redirect",
  passport.authenticate("discord"),
  (request, response) => {
    console.log("request.session: ", request.session);
    console.log(`request.user: ${request.user}`);
    response.sendStatus(200);
  }
);

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

// client_id: 1236632769610776618
// client_secret: ASwJu4XjgweTOpeTTwt9kpwqHL3gVQXw
// redirect_url: http://localhost:5000/api/auth/discord/redirect
