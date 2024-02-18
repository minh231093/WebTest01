const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

console.log(process.env.MONGODB_URL);
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

//schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  image: String,
});

const userModel = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/v1/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  try {
    const result = await userModel.findOne({ email: email }).exec();

    console.log(result);

    if (result) {
      res.send({ message: "Email id is already registered", alert: false });
    } else {
      const data = userModel(req.body);
      const save = await data.save();
      res.send({ message: "Sign up successfully", alert: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//api login
app.post("/api/v1/login", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  try {
    const result = await userModel.findOne({ email: email }).exec();

    if (result) {
      console.log(result);
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      res.send({ message: "Login successfully", alert: true });
    } else {
      res.send({ message: "Email id is not registered", alert: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//product section
const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});

const productModel = mongoose.model("product", schemaProduct);

//save product in database
//api
app.post("/api/v1/uploadProduct", async (req, res) => {
  console.log(req.body);
  const data = productModel(req.body);
  const datasave = await data.save();
  console.log(datasave);
  res.send({ message: "Product uploaded successfully" });
});

//get product from database
app.get("/api/v1/product", async (req, res) => {
  const data = await productModel.find({}).exec();
  // res.send(JSON.stringify(data));
  res.send(JSON.stringify(data));
});

//delete with id
app.delete("/api/v1/delete-product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await productModel.deleteOne(filter);
    res.send(result);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/v1/product-by-category", async (req, res) => {
  try {
    const { categories } = req.body;

    const query = { category: { $in: categories } };

    const result = await productModel.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Lấy danh sách sp theo tên
app.get("/api/v1/product-by-name/:name", async (req, res) => {
  try {
    const name = req.params.name;

    // Sử dụng $regex để tìm kiếm tên dựa trên keyword
    const query = { name: { $regex: new RegExp(name, "i") } };
    const result = await productModel.find(query).toArray();

    res.send(result);
  } catch (error) {
    console.error("Error fetching products by name:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
