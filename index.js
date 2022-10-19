const express = require('express');
const app = express();
const cors = require ('cors');
const objectId = require('mongodb').ObjectId;
// middleware
app.use (cors());
app.use(express.json());
const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3tttp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" `;
const client = new MongoClient(uri, {
     useNewUrlParser: true, useUnifiedTopology: true} );

     async function run(){
            try {
                    await client.connect();
                   const database = client.db("tourism");
                   const servicesCollection  = database.collection('services');
                   const orderCollection = database.collection('orders');                
                    // get data
                    app.get('/services',async(req,res)=>{
                        const cursor = servicesCollection.find({});
                        const services = await cursor.toArray();
                       res.send(services);
                    });

                    // orders api
                    app.post ('/orders', async (req,res) =>{
                        const order = req.body;
                       const result = await orderCollection.insertOne(order);
                        res.send(result);
                    });
                    // get single service
                    app.get('/services/:id',async(req,res)=>
                    {
                        const id = req.params.id;
                        console.log('getting service',id);
                        const querry = { _id: objectId(id) }; 
                        const service = await servicesCollection.findOne(querry);
                        res.json(service);
                    });

                //    postAPI

                app.post('/services',async(req,res)=>{
                    const service = req.body;
                      
                    
                    const result = await servicesCollection.insertOne(service);
                        console.log(result);
                });
            }

            finally{
                    // await client.close();
            }
     }
run().catch(console.dir);

const port = process.env.PORT || 5000;

app.get('',(req,res)=>{
    res.send('genius server');
});


app.listen(port,()=>{
        console.log('port running',port);
})