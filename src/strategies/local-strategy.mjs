import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helper.mjs";

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
    const findUser = await User.findById({ _id: id });
    if (!findUser) throw new Error("User not found!");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username: username });
      if (!findUser) throw new Error("User not found");
      if (!await comparePassword(password, findUser.password))
        throw new Error("Bad Credentials");
      done(null, findUser);
    } catch (err) {
      // all errors occured above will be caught in this error block
      done(err, null);
    }
  })
);
