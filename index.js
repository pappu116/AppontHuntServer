const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs-extra");
const fileUpload = require("express-fileUpload");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bfpdn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("service"));
app.use(fileUpload());

const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello From Db Working :)!");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("services");
  const orderCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("order");

  //add order to

  //   app.post("/addOrder", (req, res) => {
  //     const order = req.body;
  //     orderCollection.insertOne(order).then((result) => {
  //       res.send(result.insertedCount > 0);
  //     });
  //   });

  //order red code
  app.get("/allOrder", (req, res) => {
    orderCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //service red code

  app.get("/service", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //service add
  app.post("/addService", (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const location = req.body.location;
    const bathroom = req.body.bathroom;
    const price = req.body.price;
    const bedroom = req.body.bedroom;
    const newImg = req.files.file.data;
    const encImg = newImg.toString("base64");

    var image = {
      contentType: req.files.file.mimetype,
      size: req.files.file.size,
      img: Buffer.from(encImg, "base64"),
    };
    serviceCollection
      .insertOne({ title, price, bedroom, bathroom, location, image })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });
});

app.listen(process.env.PORT || port);
