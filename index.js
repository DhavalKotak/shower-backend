const { Sequelize, Model, DataTypes } = require("sequelize");
const express = require("express");
const app = express();
const cors = require("cors");

const user = "yourUser";
const host = "yourHost";
const database = "DBNAME";
const password = "PASSWORD";
const dbPort = "PORT";

const dbUri =
  process.env.DATABASE_URL ||
  `postgres://${user}:${password}@${host}:${dbPort}/${database}`;

const sequelize = new Sequelize(dbUri, {
  dialect: "postgres",
  logging: false,
});

app.use(cors());
app.use(express.static("public"));

class Songs extends Model {}

//defining the table structure
Songs.init(
  {
    song_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    song_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    artist_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Songs",
    timestamps: false,
  }
);

//creating the table
Songs.sync();

app.get("/songs", (req, res) => {
  Songs.findAll()
    .then((result) => res.json(result))
    .catch((err) => res.status(500).send(err));
});

app.get("/play", (req, res) => {
  try {
    res.sendFile(__dirname + `/public/${req.query.song}.mp3`);
  } catch (err) {
    res.sendStatus(404).send(err);
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening at ${port}`));
