const express = require("express");
const morgan = require("morgan");
const axios = require("axios");

const app = express();

app.use(morgan("tiny"));

app.get("/booklet/list", (req, res) =>
  axios
    .get("https://www.cccstc.org/_functions/services?limit=52")
    .then(r => r.data)
    .then(d => d.services)
    .then(services =>
      services.map(d => {
        let weekStrArr = (d.week || "").split("-");
        let week = 0;
        if (weekStrArr.length === 2) {
          week = weekStrArr[1].trim();
        }
        return Object.assign(
          {},
          { date: d.displayDate, week: +week, booklet: d.pdf }
        );
      })
    )
    .then(booklets => res.json({ booklets }))
    .catch(err => res.status(500).json({ error: err }))
);

app.get("/record/list", (req, res) =>
  axios
    .get("https://www.cccstc.org/_functions/records?limit=50")
    .then(r => r.data)
    .then(d => d.records)
    .then(records =>
      records.map(d =>
        Object.assign(
          {},
          {
            date: d.displayDate,
            session: d.speaker,
            content: d.description,
            week: d.week,
            audio: d.mp3
          }
        )
      )
    )
    .then(records => res.json({ records }))
    .catch(err => res.status(500).json({ error: err }))
);

module.exports = app;
