import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "dotenv";
config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI,)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/auth", require("./routes/auth"));
app.use("/tasks", require("./routes/tasks"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));