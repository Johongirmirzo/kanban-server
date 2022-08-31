const { gql, UserInputError } = require("apollo-server");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { registerValidator, loginValidator } = require("../../utils/validator");

const userResolvers = {
  Mutation: {
    async register(
      parent,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      const { isValid, errors } = registerValidator(
        username,
        email,
        password,
        confirmPassword
      );
      console.log("Registering");
      if (!isValid) {
        throw new UserInputError("User input errors", { errors });
      }

      if (
        await User.findOne({
          $and: [{ username }, { email }],
        })
      ) {
        throw new UserInputError("Username and Email already taken", {
          errors: {
            usernameDuplicate: "Username already taken",
            emailDuplicate: "Email already taken",
          },
        });
      } else if (await User.findOne({ username })) {
        throw new UserInputError("Username already taken", {
          errors: {
            error: "Username already taken",
          },
        });
      } else if (await User.findOne({ email })) {
        throw new UserInputError("Email already taken", {
          errors: {
            error: "Email already taken",
          },
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      return await User.create({
        username,
        email,
        password: hashedPassword,
      });
    },
    async login(parent, { email, password }) {
      const { isValid, errors } = loginValidator(email, password);
      if (!isValid) {
        throw new UserInputError("User input errors", { errors });
      }
      const user = await User.findOne({ email });
      if (!user) {
        throw new UserInputError("User does not exist", {
          errors: { error: "User with given email does not exist" },
        });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        throw new UserInputError("Password not exist", {
          errors: { error: "Given password does not exist" },
        });
      }
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.PRIVATE_KEY,
        { expiresIn: "24h" }
      );
      console.log({ username: user.username, token });
      return {
        ...user._doc,
        id: user._id,
        token,
        email,
        password,
      };
    },
  },
};

module.exports = userResolvers;
