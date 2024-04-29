
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");

// Define your GraphQL schema using gql
const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        username:String!
        email:String!
        phone:String!
        website:String!
    }
    type Todo {
        id: ID!
        title: String!
        completed: Boolean
        user:User
        userId:ID!
    }
    type Query {
        getTodos: [Todo]
        getAllUsers:[User]
        getUser (id: ID!):User  
    }
`;

// Define your resolvers 
// Todo resolver is here to get user of the particular todo. where User and Todo are diffrent databases
//so if we need user from todo then firstly we will access Todo Db and from it we will access its id field
//and with the help of id we will access user in UserDb
const resolvers = {
    Todo:{
        user: async(todo)=> (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data
    },
    Query: {
        getTodos: async () => (await  axios.get('https://jsonplaceholder.typicode.com/todos')).data ,
        // resolver for gettingall users
        getAllUsers:async()=>(await axios.get('https://jsonplaceholder.typicode.com/users')).data ,
        getUser:async(parent , {id})=> (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data
    },
};

async function startServer() {
    const app = express();

    // Create an instance of ApolloServer
    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    // Start Apollo Server
    await server.start();

    // Apply Apollo middleware to connect it with Express
    server.applyMiddleware({ app, path: "/graphql" });

    // Use body-parser middleware to parse JSON requests
    app.use(bodyParser.json());

    // Use CORS middleware to allow cross-origin requests
    app.use(cors());

    // Start the Express server
    app.listen(3000, () => console.log("Server listening on port 3000"));
}

startServer();
