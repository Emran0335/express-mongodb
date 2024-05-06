import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

// to learn more, we have to search it in the stackoverflow
passport.serializeUser((user, done) => {
  console.log(`Inside Serialize User`);
  console.log(user);
  done(null, user.id); //the argument of done function ->user.id(unique)
});

passport.deserializeUser(async (id, done) => {
  console.log(`Inside DeserializeUser`);
  console.log(`Deserializing User Id: ${id}`);
  try {
    const findUser = await DiscordUser.findById({ _id: id });
    return findUser ? done(null, findUser) : done(null, null);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: "1236632769610776618",
      clientSecret: "ASwJu4XjgweTOpeTTwt9kpwqHL3gVQXw",
      callbackURL: "http://localhost:5000/api/auth/discord/redirect",
      //   scope: ["identify", "guilds", "email"],
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      let findUser;
      try {
        findUser = await DiscordUser.findOne({ discordId: profile.id });
      } catch (err) {
        return done(err, null);
      }
      try {
        if (!findUser) {
          const newUser = new DiscordUser({
            username: profile.username,
            discordId: profile.id,
          });
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }
        return done(null, findUser);
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);
