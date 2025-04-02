const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const inventoryRoutes = require("./routes/inventory");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Add a route for "/"
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Mount the routes correctly
app.use("/api", inventoryRoutes); // Ensure your routes have a prefix if needed

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
