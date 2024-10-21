
const express = require("express");
const cors = require("cors");
require("dotenv").config()

const app = express();

const port = process.env.PORT || 5000;


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET}@cluster0.87nis.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        // creating database and collection
        // const userCollection = client.db("bootcampUsersDB").collection("users");
        const userListCollection = client.db("learnSphereDB").collection("userList");

        // LearnSphere Database operation start

        // getting data from database
        app.get("/userList", async (req, res) => {
            const query = userListCollection.find();
            const result = await query.toArray();
            res.send(result);
        })

        // fetching single user data
        app.get("/userList/:uid", async (req, res) => {
            const id = req.params.uid;
            const query = { userId : id };
            const result = await userListCollection.findOne(query);
            console.log(result);
            res.send(result);
        })

        // fetching data from form fileds and insertion into database 
        app.post("/userList", async (req, res) => {
            const users = req.body;
            console.log(users);
            const result = await userListCollection.insertOne(users);
            res.send(result);
        });

        // LearnSphere Database operation end



        // reading data in table
        // app.get("/users", async(req, res)=>{
        //     const query = userCollection.find();
        //     const result = await query.toArray();
        //     res.send(result);
        // })

        // fetching data for edit
        // app.get("/user/:id", async(req, res)=>{
        //     const id = req.params.id;
        //     const query = {_id : new ObjectId(id)};
        //     const result = await userCollection.findOne(query);
        //     console.log(result);
        //     res.send(result);
        // })

        // fetching data for insertion into database and processing
        // app.post("/users", async(req, res)=>{
        //     const users = req.body;
        //     console.log(users);
        //     const result = await userCollection.insertOne(users);
        //     res.send(result);
        // }); 

        // edit data in table
        // app.put("/user/:id", async(req, res)=>{
        //     const id = req.params.id;
        //     const user = req.body;
        // console.log(id, user);

        //     const filter = { _id : new ObjectId(id)};
        //     const option = {upsert: true};

        //     const updatedUser = {
        //         $set: {
        //             name: user.name,
        //             email: user.email,
        //         },
        //     };
        //     const result = await userCollection.updateOne(
        //         filter, updatedUser, option);
        //         console.log("Server response is: ", result);
        //     res.send(result);
        // })

        // deleting data from table
        // app.delete("/users/:id", async(req, res)=>{
        //     const id = req.params.id;
        //     console.log(id);
        //     const query = {_id : new ObjectId(id)};
        //     const result = await userCollection.deleteOne(query);
        //     res.send(result);
        // })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch((error) => {
    console.log(error);
});


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("The LearnSphere Full-Stack Server is Running");
});

app.listen(port, () => {
    console.log(`The LearnSphere Full-Stack Server is Running on ${port}`);
});