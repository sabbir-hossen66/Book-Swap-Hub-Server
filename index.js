const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())

// mongodb atlas connected code


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.neggqyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const postCollection = client.db('booksSwap').collection('posts')
    const myCollection = client.db('booksSwap').collection('read')

    // to read data
    app.get('/posts', async (req, res) => {
      const cursor = postCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // showing only my query

    // app.get('/posts/:email', async (req, res) => {
    //   const email = req.params.email;
    //   const filter = { email: email };
    //   const result = await postCollection.find(filter).toArray()
    //   res.send(result)
    // })


    // recommendation read
    app.get('/recommendation', async (req, res) => {
      const cursor = myCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })

    // recommendation creating
    app.post('/recommendation', async (req, res) => {
      const newRecom = req.body;
      const result = await myCollection.insertOne(newRecom)
      res.send(result)

    })


    // by selecting id for update
    app.get('/posts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await postCollection.findOne(query)
      res.send(result)
    })

    // to go to update
    app.put('/posts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedBook = req.body
      const book = {
        $set: {
          productName: updatedBook.productName,
          brandProduct: updatedBook.brandProduct,
          title: updatedBook.title,
          boycot: updatedBook.boycot,
          productPhoto: updatedBook.productPhoto
        }
      }
      const result = await postCollection.updateOne(filter, book, options);
      res.send(result)
    })
    // to send to database 
    app.post('/posts', async (req, res) => {
      const newPost = req.body;
      const result = await postCollection.insertOne(newPost);
      res.send(result)
    })

    // delete query
    app.delete('/posts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await postCollection.deleteOne(query)
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
  res.send('this is book house')
})

app.listen(port, () => {
  console.log(`bookhouse is running on the port ${port}`);
})