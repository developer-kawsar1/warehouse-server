
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
const express = require('express'); 
const cors=require("cors") 

const app=express() 
const port=process.env.PORT || 5000 
// middleware 
app.use(cors()) 
app.use(express.json())
app.get('/',(req,res)=>{
    res.send("running genious server")
})

app.listen(port,(req,res)=>{
    console.log("listening on 5000");
})







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w1mzy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
  try{
     await client.connect(); 
     const serviceCollection=client.db('groceryDB').collection('product')

    app.get('/product', async(req,res)=>{
        const query={}
        const cursor=serviceCollection.find(query);
        const products= await cursor.toArray() 
        res.send(products)
    }) 
    app.get('/product/:id', async(req,res)=>{
        const id=req.params.id
        const query={_id:ObjectId(id)} 
        const product= await serviceCollection.findOne(query)
        res.send(product)
    }) 

    // post 
    app.post('/product',async(req,res)=>{
        const newProduct=req.body 
        console.log(newProduct);
        const result=await serviceCollection.insertOne(newProduct) 
        res.send(result) 
        console.log(result); 
        

    }) 
    // delete api 

    app.delete('/product/:id' ,async(req,res)=>{
        const id=req.params.id 
        const query={_id:ObjectId(id)}
        const result=await serviceCollection.deleteOne(query)
        res.send(result)

    }) 
    // update user 
    app.put('/product/:id' ,async (req,res)=>{
        const id=req.params.id 

        const updatedQuantity=req.body 
        const filter={_id:ObjectId(id)} 
        const option={upsert:true} 
        const updateDoc = {
            $set: {
              quantity:updatedQuantity.quantity
            }
          }; 

          const result = await serviceCollection.updateOne(filter, updateDoc, option);
          res.send(result)
        console.log(updatedQuantity); 
    })
  }finally{

  }
} 
run().catch(console.dir)
