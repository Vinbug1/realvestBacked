const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
// const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

mongoose.set("strictQuery", true);

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan("tiny"));
// app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

//Routes
const categoriesRoutes = require("./routes/categories");
const interestsRoutes = require("./routes/interests");
const investmentsRoutes = require("./routes/investments");
const itemsRoutes = require("./routes/items");
const maintenancesRoutes = require("./routes/maintenances");
const postsRoutes = require("./routes/posts");
const repairsRoutes = require("./routes/repairs");
const transactionsRoutes = require("./routes/transactions");
const usersRoutes = require("./routes/users");

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/interests`, interestsRoutes);
app.use(`${api}/investments`, investmentsRoutes);
app.use(`${api}/items`, itemsRoutes);
app.use(`${api}/maintenance`, maintenancesRoutes);
app.use(`${api}/posts`, postsRoutes);
app.use(`${api}/repairs`, repairsRoutes);
app.use(`${api}/transactions`, transactionsRoutes);
app.use(`${api}/users`, usersRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "hualage_db",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

//Server
app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
