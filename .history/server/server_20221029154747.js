const { GraphQlServer, PubSub } = require("graphql-yoga");

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
        postMessage(userId: String,user: String!, content: String!): ID!
    }
    type Subscription{
        messages: [Message!]
    }
`;

const members = [];

const resolvers = {
    Query: {
        messages: () => messages
    },
    Mutation: {
        postMessage: (parent, { userId, user, content }) => {
            const id = messages.length;
            messages.push({
                id,
                userId,
                user,
                content
            });
            members.forEach(fn => fn());
            return id;
        }
    },
    Subscription: {
        messages: {
            subscribe: (parent, args, { pubsub }) => {
                const channel = Math.random().toString(36).slice(2, 15);
                members.push(pubsub.publish(channel, { messages }));
                setTimeout(() => {
                    pubsub.publish(channel, { messages })
                }, 0);
                return pubsub.asyncIterator(channel);
            }
        }
    }
};
 

PubSub = new PubSub();
const server = new GraphQlServer({ typeDefs, resolvers, context: { PubSub } });

server.start(({port})=>{
    console.log(`Server on port ${port}`);
})