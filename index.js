import express from "express";
import morgan from "morgan";
import mysql from "mysql";
import {ListBooklet} from "./lib/wordpress-data";

module.exports = (MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USERNAME, MYSQL_PASSWORD) => {
  const app = express();

  const mysqlConn = mysql.createPool({
    connectionLimit : 10,
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USERNAME,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
  });

  app.use(morgan("tiny"));

  app.get(
    "/booklet/list",
    (req, res) =>
      ListBooklet(mysqlConn)()
        .toArray()
        .subscribe(
          (booklets) => res.json({booklets}),
          (err) => res.status(500).json({ error: err }),
          () => {}
        )
  );

  return app;
};
