const line = require("@line/bot-sdk");
const express = require("express");
const axios = require("axios").defaults;
const dotenv = require("dotenv");

const env = dotenv.config().parsed;
// console.log(env)
const app = express();

const lineConfig = {
  channelAccessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN,
};

const client = new line.Client(lineConfig);

app.post("/webhook", line.middleware(lineConfig), async (req, res) => {
  try {
    const events = req.body.events;
    return events.length > 0
      ? await events.map((item) => handleEvent(item))
      : res.status(200).send("OK");
  } catch (error) {
    res.status(500).end();
  }
});
app.use(express.json());

app.post("/send-message", async (req, res) => {
  try {
    console.log(req);
    client.pushMessage(req.body.userId, {
      type: "text",
      text: req.body.message,
    });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
});

const handleEvent = async (event) => {
  console.log(event);
  if (event.type != "message" && event.message.type != "test") {
    console.log("HELLO");
    return null;
  } else if (event.type === "message") {
    console.log("HE::O");
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: event.message.text,
    });
  }
};

app.listen(4000, () => {
  console.log("listening on 4000");
});
