import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Mongo error:", err));

const inviteSchema = new mongoose.Schema({
    date: String,
    place: String,
    info: String,
    createdAt: { type: Date, default: Date.now },
});

const Invite = mongoose.model("Invite", inviteSchema);

app.post("/api/invite", async (req, res) => {
    const { date, place, info } = req.body;

    if (!date) {
        return res.status(400).json({ message: "Date is required." });
    }

    try {
        const invite = new Invite({ date, place, info });
        await invite.save();
        res.status(200).json({ message: "Invite saved." });
    } catch (err) {
        res.status(500).json({ message: "Error saving invite." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});