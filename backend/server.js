import express from "express";
import cors from "cors";
import checkInputRoute from "./routes/check-input.js";
import authRoute from "./routes/auth.js";
import orderRoute from "./routes/order.js";

const app = express();

app.use(express.json());

app.use(cors({
    origin: ["http://127.0.0.1:5500", "chrome-extension://kbfmgmlcmfikaahhjgkkdjlnfeilmghi"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));


app.post("/test", (req, res) =>{
    const data = req.body;
    res.status(201).json({data});
});


app.use("/check", checkInputRoute);
app.use("/auth", authRoute);
app.use("/order", orderRoute);

const PORT = 3000;
app.listen(PORT, () => {
    console.log("running on port", PORT);    
});