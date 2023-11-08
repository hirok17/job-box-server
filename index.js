const express =require('express');
const cors = require('cors');
// const cookieParser =require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const jwt =require('jsonwebtoken');
require('dotenv').config()
const app = express();
const port =process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// app.use(cookieParser());

console.log(process.env.DB_USER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4cojmrb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// middlewares

// const logger =async(req, res, next)=>{
//   console.log(req.host. require, originalurl);
//   next();
// }
// const verifyToken =async(req, res, next)=>{
//   const token=req.cookies?.token;
//   if(!token){
//     return res.status(401).send({'not authorise'})
//   }
// }
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jobCollection = client.db("jobBox").collection("jobs");
    const categoryCollection = client.db("jobBox").collection("category");
   

    // auth api
    // app.post('/jwt', logger, async(req, res)=>{
    //   const user=req.body;
    //   const token =jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '1h'});
    //   res
    //   .cookie('token', token, {
    //     httpOnly: true,
    //     secure: false,
        
    //   })
    //   .send({success:true});
    // })

    app.post('/jobs', async(req, res)=>{
      const job =req.body;
      const result=await jobCollection.insertOne(job);
      res.send(result);
    })

    app.get('/jobs', async(req, res)=>{
        const cursor =jobCollection.find();
        const result =await cursor.toArray();
        res.send(result);
    })

    app.get('/jobs/bid/:id', async(req, res)=>{
        const id =req.params.id;
        const query ={_id: new ObjectId(id)};
        const result =await jobCollection.findOne(query);
        res.send(result);
    })
    
    app.get('/category', async(req, res)=>{
      const cursor =categoryCollection.find();
      const result =await cursor.toArray();
      res.send(result);
  })
  
  app.get('/jobs/:category', async(req, res)=>{
    const category =req.params.category;
    const query ={'category': category};
    const result =await jobCollection.find(query).toArray();
    res.send(result);
  })


    // app.delete('/orders/:id', async(req, res)=>{
    //   const id =req.params.id;
    //   const query ={_id: new ObjectId(id)};
    //   const result =await orderCollection.deleteOne(query);
    //   res.send(result);
    // })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('server is running');
})

app.listen(port);