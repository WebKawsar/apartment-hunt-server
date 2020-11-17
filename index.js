const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const port = 8080;

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.u2izr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("Welcome to Apartment Hunt server");
});

client.connect((err) => {
  const addServiceCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("addService");

  app.post("/addService", (req, res) => {
    const file = req.files.file;
    const encImg = file.data.toString("base64");
    const image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };
    const { title, price, location, bedroom, bathroom } = req.body;
    addServiceCollection
      .insertOne({ title, price, location, bedroom, bathroom, image })
      .then((result) => {
        return res.send(result.insertedCount > 0);
      });
  });

  app.get("/getAllServices", (req, res) => {
    addServiceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  console.log("Database Connected");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Apartment Hunt listening at http://localhost:${port}`);
});
