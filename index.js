const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId= require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0js5x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();

        const database = client.db('Glass')
        const productsCollection= database.collection('products');
        const usersCollection= database.collection('users');
        const orderedCollection= database.collection('odered');

        //Get All
        app.get('/products', async (req, res)=>{
            const result = await productsCollection.find({}).toArray();
            res.send(result)
        })
        
        //Get One
        app.get('/products/:id', async (req, res)=>{
            const id = req.params.id;
            const service = {_id:ObjectId(id)};
            const result = await serviceCollection.findOne(service);
            console.log(result)
            res.send(result)
        })
        //Post
        app.post('/ordered', async (req, res)=>{
            const service= req.body;
            const result = await orderedCollection.insertOne(service);
            res.json(result)
        })
        //get
        app.get('/ordered', async (req, res)=>{
            const email = req.query.email;
            const query = { useremail: email };
            const cursor = orderedCollection.find(query);
            const ordered = await cursor.toArray();
            res.json(ordered)
        })

        //Delete
        app.delete('/products/:id', async (req, res)=>{
            const id = req.params.id;
            const service = {_id:ObjectId(id)}
            const result= await serviceCollection.deleteOne(service)
            res.send(result)
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Running Glass Server')
});

app.listen(port, ()=>{
    console.log("Running Glass Server on port",port)
})