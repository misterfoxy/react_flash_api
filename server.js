require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-4nrv9.azure.mongodb.net/test?retryWrites=true&w=majority`;


// START DATABSE
const mongoose = require('mongoose')
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB Connected…')
  })
  .catch(err => console.log(err))

  const CollectionSchema = new mongoose.Schema({

      title: String,
      flashcards: [Object]

  })

  const CollectionModel = mongoose.model("Collection", CollectionSchema)

//END DATABASE


// START ROUTERS
app.listen(port, ()=>{
    console.log('Listening on port:' + port)
})

app.get(`/flashcards/:id`, async (req, res) => {
    try{
        const collectionId = req.params.id

        const Collection = await CollectionModel.findById(collectionId)

        if (!Collection) res.status(404).send("None found")
        res.status(200).json({data:Collection})
    } catch (err) {
        res.status(500).send(err)
    }
})

app.get('/flashcards', async (req, res) => {
    const collections = await CollectionModel.find({});

  try {
    res.json({data:collections});
  } catch (err) {
    res.status(500).send(err);
  }
})

app.post(`/flashcards/new`, async (req, res)=> {
    const Collection = new CollectionModel(req.body)

    try{
        await Collection.save();
        res.json({data: Collection});
    } catch(err){
        res.status(500).json({err})
    }
})

//END ROUTERS

