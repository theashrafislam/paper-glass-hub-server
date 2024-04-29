const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.POST || 5000;

//middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://paper-glass-hub.web.app",
      "https://paper-glass-hub.firebaseapp.com",
    ],
  })
);
app.use(express.json())
{ console.log(process.env.DB_USER); }
{ console.log(process.env.DB_PASS); }

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gphdl2n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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

    const paperCollection = client.db("paperCollection").collection("paperData");
    const artAndCarftItemCollection = client.db("paperCollection").collection("artCarftData");


    app.post('/craftItems', async (req, res) => {
      const data = req.body;
      const result = await paperCollection.insertOne(data);
      res.send(result)
    })

    app.post('/artAndCarftItems', async(req, res) => {
      const data = req.body;
      const result = await artAndCarftItemCollection.insertOne(data);
      res.send(result)
    })

    app.get('/artAndCarftItems', async (req, res) => {
      const cursor = artAndCarftItemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/craftItems', async (req, res) => {
      const cursor = paperCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/craftItems/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await paperCollection.findOne(query);
      res.send(result);
    })

    app.put('/craftItems/:id', async (req, res) => {
      const id = req.params.id;
      const updateInfo = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          photo: updateInfo.photo,
          itemName: updateInfo.itemName,
          subCategory: updateInfo.subCategory,
          shortDescription: updateInfo.shortDescription,
          price: updateInfo.price,
          rating: updateInfo.rating,
          processingTime: updateInfo.processingTime,
          stockStatus: updateInfo.stockStatus,
          customization: updateInfo.customization,
          email: updateInfo.email,
          displayName: updateInfo.displayName
        }
      };
      const result = await paperCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    app.get('/craftItemsInfo/:email', async (req, res) => {
      const myEmaill = req.params.email;
      const filter = { email: myEmaill }
      const result = await paperCollection.find(filter).toArray()
      res.send(result);
    })

    app.delete('/craftItemsInfo/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await paperCollection.deleteOne(query);
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('paper-glass-server is running')
})

app.listen(port, () => {
  console.log(`paper-glass-server running port on: ${port}`)
})