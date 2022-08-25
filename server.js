require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/schema/typeDefs");
const connectDB = require("./config/connectDB");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

console.log(process.env.PORT, process.env.MONGODB_URI);
const PORT = process.env.PORT || 5500;
server.listen({ port: PORT }).then(({ url }) => {
  connectDB();
  console.log(`Server is listening on url: ${url}`);
});
