require("./db");
const { ApolloServer } = require("apollo-server-express");
const cookieParser = require("cookie-parser");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const express = require("express");
const http = require("http");
const { typeDefs } = require("./schema");
const Authentication = require("./service/Auth.service");
const { resolvers } = require("./resolver");
const verifyUser = require("./middlewares/verifyUser");
const UserProfile = require("./service/User.service");

(async (typeDefs, resolvers) => {
  const app = express();
  app.use(cookieParser());
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    context: ({ req, res }) => ({
      req,
      res,
      middlewares: {
        verifyUser: () => verifyUser(req),
      },
      services: {
        authService: new Authentication(),
        userService: new UserProfile(),
      },
    }),
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      origin: [
        "https://www.your-app.example",
        "https://studio.apollographql.com",
      ],
      credentials: true,
    },
  });
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
})(typeDefs, resolvers);
