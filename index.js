const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const port = 8080


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.u2izr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(cors());
app.use(express());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload())


app.get('/', (req, res) => {
  res.send('Welcome to Apartment Hunt server')
})


client.connect(err => {
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("addService");


  app.post("/addService", (req, res) => {

    const file = req.files.image;
    const insertData = JSON.parse(req.body.data);

    const newImg = file.data;
    const encodedImg = newImg.toString("base64");

    const image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encodedImg, "base64"),
    };

    insertData.image = image;
    serviceCollection.insertOne(insertData)
    .then(result => {

      res.send(result.insertedCount > 0)
    })

  })

  app.get("/getAllServices", (req, res) => {
    serviceCollection.find({})
    .toArray((documents, error) => {

      console.log(documents);
    })
  })


  console.log("Database Connected");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Apartment Hunt listening at http://localhost:${port}`)
})
