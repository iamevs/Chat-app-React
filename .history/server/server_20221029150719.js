import { GraphQlServer } from 'graphql-yoga';

const messages = [];

const typeDefs = `
    type Message{
        id: ID!
        userId: String!
        user: String!
        content: String!
    }
    type Query{
        messages: [Message!]
    }
    type Mutation{
        postMessage(user: String!, content: String!): ID!
    }
`;

