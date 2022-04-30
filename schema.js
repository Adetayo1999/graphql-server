const { gql } = require("apollo-server-core");

exports.typeDefs = gql`
  type Query {
    getUser: getUserResponse!
    getNewAccessToken: tokenResponse!
  }

  type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): createUserResponse!
    loginUser(email: String!, password: String!): tokenResponse!
    logoutUser: logoutUserResponse!
  }

  type getUserResponse {
    code: Int!
    message: String!
    user: User
  }

  type logoutUserResponse {
    code: Int!
    message: String!
  }

  type createUserResponse {
    code: Int!
    message: String!
    user: User
  }

  type tokenResponse {
    code: Int!
    message: String!
    token: String
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    age: Int
  }
`;
