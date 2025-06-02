const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.urlencoded());
app.use(express.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;

  console.log(event);

  events.push(event);

  axios.post("http://posts-clusterip-srv:4000/events", event);
  axios.post("http://comments-srv:4001/events", event);
  axios.post("http://query-srv:4002/events", event);
  axios.post("http://moderation-srv:4003/events", event);

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, (err) => {
  if (err) return console.log(err);
  console.log("Listening at port 4005");
});
