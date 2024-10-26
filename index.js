
const express = require("express");
const cors = require("cors");
require("dotenv").config()

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // await client.connect();


        // creating database and collection
        // const userCollection = client.db("bootcampUsersDB").collection("users");
        const userListCollection = client.db("learnSphereDB").collection("userList");
        const courseCollection = client.db("learnSphereDB").collection("courses");
        const purchaseCollection = client.db("learnSphereDB").collection("purchaselogs");
        const categoryCollection = client.db("learnSphereDB").collection("categories");

        // LearnSphere Database operation start

        // getting data from database
        app.get("/userList", async (req, res) => {
            const query = userListCollection.find();
            const result = await query.toArray();
            res.send(result);
        })
        // fetching single user data
        app.get("/userList/:_id", async (req, res) => {
            const id = req.params._id;
            const query = { userId: id };
            const result = await userListCollection.findOne(query);
            // console.log(result);
            res.send(result);
        })

        // fetching data from form fileds and insertion into database 
        app.post("/userList", async (req, res) => {
            const users = req.body;
            // console.log(users);
            const result = await userListCollection.insertOne(users);
            res.send(result);
        });

        // edit data in table
        app.put("/userList/:_id", async (req, res) => {
            const id = req.params._id;
            const user = req.body;
            // console.log(id, user);

            // Validate ObjectId
            if (!ObjectId.isValid(id)) {
                return res.status(400).send({ message: "Invalid user ID" });
            }

            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };

            const updatedUser = {
                $set: {
                    displayName: user.displayName,
                    phoneNumber: user.phoneNumber,
                    photoURL: user.photoURL,
                    address: user.address,
                },
            };

            try {
                const result = await userListCollection.updateOne(filter, updatedUser, option);

                if (result.matchedCount === 0) {
                    return res.status(404).send({ message: "User not found" });
                }

                console.log("Server response is: ", result);
                res.send({ message: "User updated successfully", result });
            } catch (error) {
                console.error("Error updating user:", error);
                res.status(500).send({ message: "Failed to update user", error: error.message });
            }

        })

        //---------- End of user management----------

        // ---------Start of Course management---------

        // getting course data from database
        app.get("/courses", async (req, res) => {
            const query = courseCollection.find();
            const result = await query.toArray();
            res.send(result);
        })

        // fetching course data for edit
        app.get("/course/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await courseCollection.findOne(query);
            // console.log(result);
            res.send(result);
        })

        // fetching course data for insertion into database and processing
        app.post("/courses", async (req, res) => {
            const courses = req.body;
            // console.log(courses);
            const result = await courseCollection.insertOne(courses);
            res.send(result);
        });

        // edit course data in table
        app.put("/course/:id", async (req, res) => {
            const id = req.params.id;
            const course = req.body;
            // console.log(id, course);

            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };

            const updatedCourse = {
                $set: {
                    title: course.title,
                    category: course.category,
                    categoryId: course.categoryId,
                    image: course.image,
                    price: course.price,
                    rating: course.rating,
                },
            };
            const result = await courseCollection.updateOne(
                filter, updatedCourse, option);
            // console.log("Server response is: ", result);
            res.send(result);
        })
        // deleting data from table
        app.delete("/course/:id", async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await courseCollection.deleteOne(query);
            res.send(result);
        })

        // ---------End of Course Management operations--------

        // ------------Start of Course Category Operations-------------

        // getting course category data from database
        app.get("/courseCategories", async (req, res) => {
            const query = categoryCollection.find();
            const result = await query.toArray();
            res.send(result);
        })

        // Route to get courses by categoryId
        app.get("/courses/:categoryId", async (req, res) => {
            const categoryId = req.params.categoryId;
            try {
                const courses = await courseCollection.find({ categoryId }).toArray();
                res.json(courses);
            } catch (error) {
                console.error("Error fetching courses:", error);
                res.status(500).send("Internal server error");
            }
        });

        // fetching course category data for insertion into database and processing
        app.post("/courseCategories", async (req, res) => {
            const categories = req.body;
            // console.log(courses);
            const result = await categoryCollection.insertOne(categories);
            res.send(result);
        });

        // ---------end of category operations-------------


        // ---------Start user purchase--------------

        // inserting user's purchase details
        app.post("/userlogs", async (req, res) => {
            const userlogs = req.body;
            console.log(userlogs);
            const result = await purchaseCollection.insertOne(userlogs);
            res.send(result);
        });

        // fetching user purchase logs
        app.get("/userlogs", async (req, res) => {
            const query = purchaseCollection.find();
            const result = await query.toArray();
            res.send(result);
        })

        // --------End User Purchase ---------------

        // LearnSphere Database operation end
        // LearnSphere Database operation end

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch((error) => {
    console.log(error);
});


app.get("/", (req, res) => {
    res.send("The LearnSphere Full-Stack Server is Running");
});

app.listen(port, () => {
    console.log(`The LearnSphere Full-Stack Server is Running on ${port}`);
});