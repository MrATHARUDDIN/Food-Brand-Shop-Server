const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000

// midle ware
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('My server is runing..........')
})

// MongoDB Code 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w7mc7t5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbConnect = async () => {
  try {
      await client.connect()
      console.log('Database Connected!')
  } catch (error) {
      console.log(error.name, error.message)
  }
}
dbConnect()
    const Procollection = client.db("ProDB").collection("products");
    const CartCollection = client.db('ProDB').collection('Cart');
    // Send a ping to confirm a successful connection
    app.post('/product' , async(req , res) => {
        const newProduct = req.body;
            const result = await Procollection.insertOne(newProduct);
            res.send(result);
    })
    app.get('/product', async (req, res) => {
        const cursor = Procollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.put('/products/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const option = {upsert: true };
      const MyupdateProducts  = req.body;
      const update = {
        $set: {
          name: MyupdateProducts.name,
          Brandname: MyupdateProducts.Brandname,
          description: MyupdateProducts.description,
          Rating: MyupdateProducts.Rating,
          type: MyupdateProducts.type,
          Price: MyupdateProducts.Price,
          photo: MyupdateProducts.photo
      }
      }
      const result = await Procollection.updateOne(filter, update , option);
      res.send(result)
    })
    app.get('/product/:brandname', async (req, res) => {
      const brandname = req.params.brandname; 
      const query = { Brandname: brandname };
      const result = await Procollection.find(query).toArray();
      res.send(result);
    });
      app.get('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await Procollection.findOne(query);
        res.send(result);
    })

    // Cart api
    app.post('/orders' , async(req , res) => {
      const user = req.body;
      const resut = await CartCollection.insertOne(user)
      res.send(resut)
    })

    app.get('/orders', async (req, res) => {
      const cursor = CartCollection.find();
      const users = await cursor.toArray();
      res.send(users);
  })

  app.delete('/orders/:id' , async(req , res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await CartCollection.deleteOne(query);
    res.send(result);
  })

    app.listen(port, () =>
    console.log(`Server Running on Port ${ port }`),
)


