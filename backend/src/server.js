import express from "express";
import cors from "cors";
import formRoutes from "./routes/formRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";
import dotenv from "dotenv";
import { connectToDB } from "./config/dbConnect.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectToDB();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.use("/api/forms", formRoutes);
app.use("/api/users", userRoutes);
app.use("/api/responses", responseRoutes);

app.get("/", (req, res) => {
    res.status(200).send("App is running!");
});

app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
});
