const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const { randomBytes } = require("crypto");

const posts = {};

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

app.get("/posts", (req, res) => {
  console.log(posts);
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title };

  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: { id, title },
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Received Event in post: ", req.body.type);
  res.send({});
});

app.listen(4000, (err) => {
  if (err) return console.log(err);
  console.log("Listening at port 4000");
});
