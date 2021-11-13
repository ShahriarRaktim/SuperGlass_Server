const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
////nothiuubng
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0js5x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("Glass");
    const productsCollection = database.collection("products");
    const reviewCollection = database.collection("review");
    const orderedCollection = database.collection("odered");
    const usersCollection = database.collection("user");

    //Get All
    app.get("/products", async (req, res) => {
      const result = await productsCollection.find({}).toArray();
      res.send(result);
    });
    app.get("/allorder", async (req, res) => {
      const result = await orderedCollection.find({}).toArray();
      res.send(result);
    });

    //Get All
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
    });

    //Get One
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const service = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(service);
      console.log(result);
      res.send(result);
    });
    //Post
    app.post("/review", async (req, res) => {
      const service = req.body;
      const result = await reviewCollection.insertOne(service);
      res.json(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
    app.post("/ordered", async (req, res) => {
      const user = req.body;
      const result = await orderedCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
    app.post("/addproduct", async (req, res) => {
      const user = req.body;
      const result = await productsCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    //get
    app.get("/ordered", async (req, res) => {
      const email = req.query.email;
      const query = { useremail: email };
      const cursor = orderedCollection.find(query);
      const ordered = await cursor.toArray();
      res.json(ordered);
    });

    //get admin

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    //put
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //Delete
    app.delete("/ordered/:id", async (req, res) => {
      const id = req.params.id;
      const service = { _id: ObjectId(id) };
      const result = await orderedCollection.deleteOne(service);
      res.send(result);
    });
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const service = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(service);
      res.send(result);
    });
    //put make admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Glasses Server");
});

app.listen(port, () => {
  console.log("Running Glass Server on port", port);
});
